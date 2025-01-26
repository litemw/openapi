import { oas31 } from 'openapi3-ts';
import { MetaKeys, Middleware } from '@litemw/router';
import { get, noop, set } from 'lodash-es';
import { MetaPaths } from './core';

const noopBase: Middleware = noop.bind({});

export function useApiObject(obj: oas31.OpenAPIObject) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (router) => {
    set(router.metadata, MetaPaths.apiObject, obj);
  };
  return mw;
}

export function useApiInfo(info: oas31.InfoObject) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (router) => {
    set(router.metadata, [...MetaPaths.apiObject, 'info'], info);
  };
  return mw;
}

export function useApiServers(servers: oas31.ServerObject[]) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (router, handler) => {
    if (handler) {
      set(handler.metadata, [...MetaPaths.apiOperation, 'servers'], servers);
    } else {
      set(router.metadata, [...MetaPaths.apiObject, 'servers'], servers);
    }
  };
  return mw;
}

export function useApiPaths(paths: oas31.PathsObject) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (router) => {
    set(router.metadata, [...MetaPaths.apiObject, 'paths'], paths);
  };
  return mw;
}

export function useApiComponents(components: oas31.ComponentsObject) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (router) => {
    set(router.metadata, [...MetaPaths.apiObject, 'components'], components);
  };
  return mw;
}

export function useApiSecurity(security: oas31.SecurityRequirementObject[]) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (router, handler) => {
    if (handler) {
      set(handler.metadata, [...MetaPaths.apiOperation, 'security'], security);
    } else {
      set(router.metadata, [...MetaPaths.apiObject, 'security'], security);
    }
  };
  return mw;
}

export function useApiTags(tags: oas31.TagObject[]) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (router) => {
    set(router.metadata, [...MetaPaths.apiObject, 'tags'], tags);
  };
  return mw;
}

export function useApiExternalDocs(
  externalDocs: oas31.ExternalDocumentationObject,
) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (router) => {
    set(
      router.metadata,
      [...MetaPaths.apiObject, 'externalDocs'],
      externalDocs,
    );
  };
  return mw;
}

export function useApiWebhooks(webhooks: oas31.PathsObject) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (router) => {
    set(router.metadata, [...MetaPaths.apiObject, 'webhooks'], webhooks);
  };
  return mw;
}

export function useApiPathItems(path: string, pathItem: oas31.PathItemObject) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (router) => {
    set(router.metadata, [...MetaPaths.apiObject, 'paths', path], pathItem);
  };
  return mw;
}

export function useApiOperation(operation: oas31.OperationObject) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (_, handler) => {
    if (handler) set(handler.metadata, MetaPaths.apiOperation, operation);
  };
  return mw;
}

export function useApiTag(tag: string) {
  const mw = noopBase.bind({});
  const path = [...MetaPaths.apiOperation, 'tags'];
  mw[MetaKeys.metaCallback] = (_, handler) => {
    if (handler)
      set(handler.metadata, path, [
        ...(get(handler.metadata, path) ?? []),
        tag,
      ]);
  };
  return mw;
}

export function useApiSummary(summary: string) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (_, handler) => {
    if (handler)
      set(handler.metadata, [...MetaPaths.apiOperation, 'summary'], summary);
  };
  return mw;
}

export function useApiDescription(description: string) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (_, handler) => {
    if (handler)
      set(
        handler.metadata,
        [...MetaPaths.apiOperation, 'description'],
        description,
      );
  };
  return mw;
}

export function useApiOperationId(operationId: string) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (_, handler) => {
    if (handler)
      set(
        handler.metadata,
        [...MetaPaths.apiOperation, 'operationId'],
        operationId,
      );
  };
  return mw;
}

export function useApiParameter(
  param: oas31.ParameterObject | oas31.ReferenceObject,
) {
  const mw = noopBase.bind({});
  const path = [...MetaPaths.apiOperation, 'parameters'];

  mw[MetaKeys.metaCallback] = (router, handler) => {
    set(router.metadata, path, [...(get(router.metadata, path) ?? []), param]);
    if (handler)
      set(handler.metadata, path, [
        ...(get(handler.metadata, path) ?? []),
        param,
      ]);
  };
  return mw;
}

export function useApiRequestBody(
  requestBody: oas31.RequestBodyObject | oas31.ReferenceObject,
) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (_, handler) => {
    if (handler)
      set(
        handler.metadata,
        [...MetaPaths.apiOperation, 'requestBody'],
        requestBody,
      );
  };
  return mw;
}

export function useApiResponses(responses: oas31.ResponsesObject) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (_, handler) => {
    if (handler)
      set(
        handler.metadata,
        [...MetaPaths.apiOperation, 'responses'],
        responses,
      );
  };
  return mw;
}

export function useApiCallbacks(callbacks: oas31.CallbacksObject) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (_, handler) => {
    if (handler)
      set(
        handler.metadata,
        [...MetaPaths.apiOperation, 'callbacks'],
        callbacks,
      );
  };
  return mw;
}

export function useApiDeprecated() {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (_, handler) => {
    if (handler)
      set(handler.metadata, [...MetaPaths.apiOperation, 'deprecated'], true);
  };
  return mw;
}
