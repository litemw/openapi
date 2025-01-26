import { Router } from '@litemw/router';
import { oas31 } from 'openapi3-ts';
import { chain, cloneDeep, concat, merge, set } from 'lodash-es';
import { getApiObject, getApiOperation, isOpenApiMethod } from './core';

const defaultApiObject: oas31.OpenAPIObject = {
  openapi: '3.1.0',
  info: { version: '1.0.0', title: 'My OpenAPI title' },
};

const defaultApiOperation: oas31.OperationObject = {
  responses: {
    200: {},
  },
};

export function exploreApi(router: Router): oas31.OpenAPIObject {
  const schema: oas31.OpenAPIObject = cloneDeep(defaultApiObject);
  const mainRouterSchema = getApiObject(router);
  merge(schema, mainRouterSchema);

  const routerPrefix = router.opts.prefix ?? '';

  const pathSchemas = router.routeHandlers.map((h) => {
    const opSchema: oas31.PathsObject = {};

    const operation = cloneDeep(defaultApiOperation);
    const handlerSchema = getApiOperation(h);
    merge(operation, handlerSchema);

    if (isOpenApiMethod(h.method)) {
      set(opSchema, [routerPrefix + h.path, h.method], operation);
    }

    return opSchema;
  });

  const pathsObject: oas31.PathsObject = {};
  merge(pathsObject, ...pathSchemas);

  for (const [prefix, innerRouter] of router.routers) {
    const innerSchema = exploreApi(innerRouter);
    schema.servers = concat(schema.servers ?? [], innerSchema.servers ?? []);
    schema.tags = concat(schema.tags ?? [], innerSchema.tags ?? []);
    schema.security = concat(schema.security ?? [], innerSchema.security ?? []);
    merge(schema.components, innerSchema.components);

    const pathsObjects = chain(innerSchema.paths ?? {})
      .entries()
      .map(([path, schema]) => ({
        [routerPrefix + prefix + path]: schema,
      }))
      .value();
    merge(schema.paths, ...pathsObjects);
  }

  return schema;
}
