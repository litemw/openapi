import { RouteHandler, Router } from '@litemw/router';
import { get } from 'lodash-es';
import { oas31 } from 'openapi3-ts';

export enum ApiMetaKeys {
  apiMetadata = 'api-metadata',
  apiObject = 'api-object',
  apiOperation = 'api-operation',
}

export const MetaPaths = {
  apiObject: [ApiMetaKeys.apiMetadata, ApiMetaKeys.apiObject],
  apiOperation: [ApiMetaKeys.apiMetadata, ApiMetaKeys.apiOperation],
};

export function getApiObject(router: Router) {
  return get(router.metadata, MetaPaths.apiObject) as
    | oas31.OpenAPIObject
    | undefined;
}

export function getApiOperation(handlerOrRouter: RouteHandler | Router) {
  return get(handlerOrRouter.metadata, MetaPaths.apiOperation) as
    | oas31.OperationObject
    | undefined;
}

type OpenApiMethods =
  | 'get'
  | 'put'
  | 'post'
  | 'delete'
  | 'options'
  | 'head'
  | 'patch'
  | 'trace';

const openApiMethodsSet = new Set([
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'patch',
  'trace',
]);

export function isOpenApiMethod(method: string): method is OpenApiMethods {
  return openApiMethodsSet.has(method);
}
