import { Router } from '@litemw/router';
import { oas31 } from 'openapi3-ts';
import { getApiObject, getApiOperation, isOpenApiMethod } from './core';
import { MiddlwareMetaKeys } from '@litemw/middlewares';

import cloneDeep from 'lodash/cloneDeep.js';
import concat from 'lodash/concat.js';
import entries from 'lodash/entries.js';
import keys from 'lodash/keys.js';
import merge from 'lodash/merge.js';
import set from 'lodash/set.js';
import fromPairs from 'lodash';

const defaultApiObject: oas31.OpenAPIObject = {
  openapi: '3.1.0',
  info: { version: '1.0.0', title: 'OpenAPI title' },
  paths: {},
};

const defaultApiOperation: oas31.OperationObject = {
  responses: {
    200: {},
  },
};

// TODO smart merges
function exploreApiRaw(router: Router): oas31.OpenAPIObject {
  const schema: oas31.OpenAPIObject = cloneDeep(defaultApiObject);
  const mainRouterSchema = getApiObject(router);

  merge(schema, mainRouterSchema);

  const routerOp = getApiOperation(router);
  const routerTags = routerOp?.tags ?? [];
  if (routerTags.length <= 0) {
    if (router.opts.routerPath) routerTags.push(router.opts.routerPath);
    else if (router.opts.prefix) routerTags.push(router.opts.prefix);
  }

  const routerBodyMeta = router.metadata[MiddlwareMetaKeys.requestBody],
    routerPathMeta = router.metadata[MiddlwareMetaKeys.pathParams],
    routerQueryMeta = router.metadata[MiddlwareMetaKeys.query],
    routerFilesMeta = router.metadata[MiddlwareMetaKeys.files];

  const routerPrefix = router.opts.prefix ?? '';

  const pathSchemas = router.routeHandlers.map((h) => {
    const handlerBodyMeta = h.metadata[MiddlwareMetaKeys.requestBody] ?? {},
      handlerPathMeta = h.metadata[MiddlwareMetaKeys.pathParams] ?? {},
      handlerQueryMeta = h.metadata[MiddlwareMetaKeys.query] ?? {},
      handlerFilesMeta = h.metadata[MiddlwareMetaKeys.files] ?? {};

    merge(handlerBodyMeta, routerBodyMeta);
    merge(handlerPathMeta, routerPathMeta);
    merge(handlerQueryMeta, routerQueryMeta);
    merge(handlerFilesMeta, routerFilesMeta);

    const opSchema: oas31.PathsObject = {};

    const operation = cloneDeep(defaultApiOperation);

    const pathParams = entries(handlerPathMeta).map(
      ([name, data]: [string, object]) =>
        ({
          name,
          ...data,
          in: 'path',
        } as const),
    );

    const queryParams = entries(handlerQueryMeta).map(
      ([name, data]: [string, object]) =>
        ({
          name,
          ...data,
          in: 'query',
        } as const),
    );

    operation.parameters = [...pathParams, ...queryParams];

    if (keys(handlerFilesMeta).length <= 0) {
      if (handlerBodyMeta.schema) {
        operation.requestBody = {
          content: { 'application/json': handlerBodyMeta },
        };
      }
    } else {
      operation.requestBody = {
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                ...(handlerBodyMeta.schema?.properties ?? {}),
                ...fromPairs(
                  entries(handlerFilesMeta).map(([k, v]: [string, any]) => [
                    k,
                    v.schema,
                  ]),
                ),
              },
            },
          },
        },
      };
    }

    const handlerSchema = getApiOperation(h);
    merge(operation, handlerSchema);

    if (!operation?.tags?.length) {
      operation.tags = [...routerTags];
    }

    if (isOpenApiMethod(h.method)) {
      set(opSchema, [routerPrefix + h.path, h.method], operation);
    }

    return opSchema;
  });

  merge(schema.paths, ...pathSchemas);

  for (const [prefix, innerRouter] of router.routers) {
    const innerSchema = exploreApi(innerRouter);
    schema.servers = concat(schema.servers ?? [], innerSchema.servers ?? []);
    schema.tags = concat(schema.tags ?? [], innerSchema.tags ?? []);
    schema.security = concat(schema.security ?? [], innerSchema.security ?? []);
    merge(schema.components, innerSchema.components);

    const pathsObjects = entries(innerSchema.paths ?? {}).map(
      ([path, schema]) => ({
        [routerPrefix + (prefix ?? '') + path]: schema,
      }),
    );

    merge(schema.paths, ...pathsObjects);
  }

  return schema;
}

const pathParamRegex = /:(\w+)/g;

export function exploreApi(router: Router): oas31.OpenAPIObject {
  const schema = exploreApiRaw(router);

  schema.paths = fromPairs(
    entries(schema.paths ?? []).map(([path, schema]) => [
      path.replace(pathParamRegex, (_, param) => `{${param}}`),
      schema,
    ]),
  ) as unknown as oas31.PathsObject;

  return schema;
}
