import { oas31 } from 'openapi3-ts';
import { MetaKeys, Middleware } from '@litemw/router';
import { get, noop, set } from 'lodash-es';

export enum ApiMetaKeys {
  apiMetadata = 'api-metadata',
  apiObject = 'api-object',
  apiOperation = 'api-operation',
}

const noopBase: Middleware = noop.bind({});

export function useApiObject(obj: oas31.OpenAPIObject) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (router) => {
    set(router.metadata, [ApiMetaKeys.apiMetadata, ApiMetaKeys.apiObject], obj);
  };
}

export function useApiInfo(info: oas31.InfoObject) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (router) => {
    set(
      router.metadata,
      [ApiMetaKeys.apiMetadata, ApiMetaKeys.apiObject, 'info'],
      info,
    );
  };
}

export function useApiServers(servers: oas31.ServerObject[]) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (router, handler) => {
    if (handler) {
      set(
        handler.metadata,
        [ApiMetaKeys.apiMetadata, ApiMetaKeys.apiOperation, 'servers'],
        servers,
      );
    } else {
      set(
        router.metadata,
        [ApiMetaKeys.apiMetadata, ApiMetaKeys.apiObject, 'servers'],
        servers,
      );
    }
  };
}

export function useApiPaths(paths: oas31.PathsObject) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (router) => {
    set(
      router.metadata,
      [ApiMetaKeys.apiMetadata, ApiMetaKeys.apiObject, 'paths'],
      paths,
    );
  };
}

export function useApiComponents(components: oas31.ComponentsObject) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (router) => {
    set(
      router.metadata,
      [ApiMetaKeys.apiMetadata, ApiMetaKeys.apiObject, 'components'],
      components,
    );
  };
}

export function useApiSecurity(security: oas31.SecurityRequirementObject[]) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (router, handler) => {
    if (handler) {
      set(
        handler.metadata,
        [ApiMetaKeys.apiMetadata, ApiMetaKeys.apiOperation, 'security'],
        security,
      );
    } else {
      set(
        router.metadata,
        [ApiMetaKeys.apiMetadata, ApiMetaKeys.apiObject, 'security'],
        security,
      );
    }
  };
}

export function useApiTags(tags: oas31.TagObject[]) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (router) => {
    set(
      router.metadata,
      [ApiMetaKeys.apiMetadata, ApiMetaKeys.apiObject, 'tags'],
      tags,
    );
  };
}

export function useApiExternalDocs(
  externalDocs: oas31.ExternalDocumentationObject,
) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (router) => {
    set(
      router.metadata,
      [ApiMetaKeys.apiMetadata, ApiMetaKeys.apiObject, 'externalDocs'],
      externalDocs,
    );
  };
}

export function useApiWebhooks(webhooks: oas31.PathsObject) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (router) => {
    set(
      router.metadata,
      [ApiMetaKeys.apiMetadata, ApiMetaKeys.apiObject, 'webhooks'],
      webhooks,
    );
  };
}

export function useApiPathItems(path: string, pathItem: oas31.PathItemObject) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (router) => {
    set(
      router.metadata,
      [ApiMetaKeys.apiMetadata, ApiMetaKeys.apiObject, 'paths', path],
      pathItem,
    );
  };
}

export function useApiOperation(operation: oas31.OperationObject) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (_, handler) => {
    if (handler)
      set(
        handler.metadata,
        [ApiMetaKeys.apiMetadata, ApiMetaKeys.apiOperation],
        operation,
      );
  };
}

export function useApiTag(tag: string) {
  const mw = noopBase.bind({});
  const path = [ApiMetaKeys.apiMetadata, ApiMetaKeys.apiOperation, 'tags'];
  mw[MetaKeys.metaCallback] = (_, handler) => {
    if (handler)
      set(handler.metadata, path, [
        ...(get(handler.metadata, path) ?? []),
        tag,
      ]);
  };
}

export function useApiSummary(summary: string) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (_, handler) => {
    if (handler)
      set(
        handler.metadata,
        [ApiMetaKeys.apiMetadata, ApiMetaKeys.apiOperation, 'summary'],
        summary,
      );
  };
}

export function useApiDescription(description: string) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (_, handler) => {
    if (handler)
      set(
        handler.metadata,
        [ApiMetaKeys.apiMetadata, ApiMetaKeys.apiOperation, 'description'],
        description,
      );
  };
}

export function useApiOperationId(operationId: string) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (_, handler) => {
    if (handler)
      set(
        handler.metadata,
        [ApiMetaKeys.apiMetadata, ApiMetaKeys.apiOperation, 'operationId'],
        operationId,
      );
  };
}

export function useApiParameter(
  param: oas31.ParameterObject | oas31.ReferenceObject,
) {
  const mw = noopBase.bind({});
  const path = [
    ApiMetaKeys.apiMetadata,
    ApiMetaKeys.apiOperation,
    'parameters',
  ];

  mw[MetaKeys.metaCallback] = (router, handler) => {
    set(router.metadata, path, [...(get(router.metadata, path) ?? []), param]);
    if (handler)
      set(handler.metadata, path, [
        ...(get(handler.metadata, path) ?? []),
        param,
      ]);
  };
}

export function useApiRequestBody(
  requestBody: oas31.RequestBodyObject | oas31.ReferenceObject,
) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (_, handler) => {
    if (handler)
      set(
        handler.metadata,
        [ApiMetaKeys.apiMetadata, ApiMetaKeys.apiOperation, 'requestBody'],
        requestBody,
      );
  };
}

export function useApiResponses(responses: oas31.ResponsesObject) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (_, handler) => {
    if (handler)
      set(
        handler.metadata,
        [ApiMetaKeys.apiMetadata, ApiMetaKeys.apiOperation, 'responses'],
        responses,
      );
  };
}

export function useApiCallbacks(callbacks: oas31.CallbacksObject) {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (_, handler) => {
    if (handler)
      set(
        handler.metadata,
        [ApiMetaKeys.apiMetadata, ApiMetaKeys.apiOperation, 'callbacks'],
        callbacks,
      );
  };
}

export function useApiDeprecated() {
  const mw = noopBase.bind({});
  mw[MetaKeys.metaCallback] = (_, handler) => {
    if (handler)
      set(
        handler.metadata,
        [ApiMetaKeys.apiMetadata, ApiMetaKeys.apiOperation, 'deprecated'],
        true,
      );
  };
}
