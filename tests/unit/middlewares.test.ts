import { describe, test, expect, beforeEach } from 'bun:test';
import {
  useApiComponents,
  useApiDeprecated,
  useApiDescription,
  useApiExternalDocs,
  useApiInfo,
  useApiObject,
  useApiOperation,
  useApiOperationId,
  useApiParameter,
  useApiPathItems,
  useApiPaths,
  useApiRequestBody,
  useApiResponses,
  useApiSecurity,
  useApiServers,
  useApiSummary,
  useApiTag,
  useApiTags,
  useApiWebhooks,
} from '../../lib';

import * as tsafe from 'tsafe';
import { MetaKeys, RouteHandler, Router } from '@litemw/router';
import { MetaPaths } from '../../lib/core';
import { get } from 'lodash-es';

describe('OpenAPI middlewares', async () => {
  const mockRouter = { metadata: {} },
    mockHandler = { metadata: {} };
  tsafe.assert(tsafe.is<Router>(mockRouter));
  tsafe.assert(tsafe.is<RouteHandler>(mockHandler));

  beforeEach(() => {
    mockHandler.metadata = {};
    mockRouter.metadata = {};
  });

  test('ApiObject', () => {
    const src = {
      openapi: '3.1.0',
      info: { version: '1.0.0', title: 'My api' },
    };
    const apiObject = useApiObject(src);
    apiObject[MetaKeys.metaCallback]?.(mockRouter, mockHandler);
    expect(get(mockHandler.metadata, MetaPaths.apiObject)).toBeUndefined();
    expect(get(mockRouter.metadata, MetaPaths.apiObject)).toEqual(src);
  });

  test('ApiInfo', () => {
    const src = { version: '2.0.0', title: 'My api 2' };
    const apiInfo = useApiInfo(src);
    apiInfo[MetaKeys.metaCallback]?.(mockRouter, mockHandler);
    expect(get(mockHandler.metadata, MetaPaths.apiObject)).toBeUndefined();
    expect(get(mockRouter.metadata, MetaPaths.apiObject)).toEqual({
      info: src,
    });
  });

  test('ApiServers', () => {
    const src = [{ url: 'http://localhost:8080', description: 'my server' }];
    const apiServers = useApiServers(src);
    apiServers[MetaKeys.metaCallback]?.(mockRouter, mockHandler);
    expect(get(mockRouter.metadata, MetaPaths.apiObject)).toBeUndefined();
    expect(get(mockHandler.metadata, MetaPaths.apiOperation)).toEqual({
      servers: src,
    });
  });

  test('ApiPaths', () => {
    const src = {
      '/path1': { get: { responses: { 200: {} } } },
    };
    const apiPaths = useApiPaths(src);
    apiPaths[MetaKeys.metaCallback]?.(mockRouter, mockHandler);
    expect(get(mockHandler.metadata, MetaPaths.apiObject)).toBeUndefined();
    expect(get(mockRouter.metadata, MetaPaths.apiObject)).toEqual({
      paths: src,
    });
  });

  test('ApiComponents', () => {
    const src = {
      schemas: {
        Schema1: { type: 'object', properties: { str: { type: 'string' } } },
      },
    } as const;
    const apiComponents = useApiComponents(src);
    apiComponents[MetaKeys.metaCallback]?.(mockRouter, mockHandler);
    expect(get(mockHandler.metadata, MetaPaths.apiObject)).toBeUndefined();
    expect(get(mockRouter.metadata, MetaPaths.apiObject)).toEqual({
      components: src,
    });
  });

  test('ApiSecurity', () => {
    const src = [{ sec1: ['oauth2', 'token'] }];
    const apiSecurity = useApiSecurity(src);
    apiSecurity[MetaKeys.metaCallback]?.(mockRouter, mockHandler);
    expect(get(mockRouter.metadata, MetaPaths.apiObject)).toBeUndefined();
    expect(get(mockHandler.metadata, MetaPaths.apiOperation)).toEqual({
      security: src,
    });
  });

  test('ApiTags', () => {
    const src = [{ name: 'tag1', description: 'some description' }];
    const apiTags = useApiTags(src);
    apiTags[MetaKeys.metaCallback]?.(mockRouter, mockHandler);
    expect(get(mockHandler.metadata, MetaPaths.apiObject)).toBeUndefined();
    expect(get(mockRouter.metadata, MetaPaths.apiObject)).toEqual({
      tags: src,
    });
  });

  test('ApiExternalDocs', () => {
    const src = {
      url: 'http://localhost:8080',
      description: 'my docs',
    };
    const apiExternalDocs = useApiExternalDocs(src);
    apiExternalDocs[MetaKeys.metaCallback]?.(mockRouter, mockHandler);
    expect(get(mockHandler.metadata, MetaPaths.apiObject)).toBeUndefined();
    expect(get(mockRouter.metadata, MetaPaths.apiObject)).toEqual({
      externalDocs: src,
    });
  });

  test('ApiWebhooks', () => {
    const src = {
      '/path1': { get: { responses: { 200: {} } } },
    };
    const apiWebhooks = useApiWebhooks(src);
    apiWebhooks[MetaKeys.metaCallback]?.(mockRouter, mockHandler);
    expect(get(mockHandler.metadata, MetaPaths.apiObject)).toBeUndefined();
    expect(get(mockRouter.metadata, MetaPaths.apiObject)).toEqual({
      webhooks: src,
    });
  });

  test('ApiPathItems', () => {
    const src = {
      get: { responses: { 200: {} } },
    };
    const apiPathItems = useApiPathItems('/path1', src);
    apiPathItems[MetaKeys.metaCallback]?.(mockRouter, mockHandler);
    expect(get(mockHandler.metadata, MetaPaths.apiObject)).toBeUndefined();
    expect(get(mockRouter.metadata, MetaPaths.apiObject)).toEqual({
      paths: { '/path1': src },
    });
  });

  test('ApiOperation', () => {
    const src = {
      responses: { 200: {} },
      description: 'some operation',
    };
    const apiOperation = useApiOperation(src);
    apiOperation[MetaKeys.metaCallback]?.(mockRouter, mockHandler);
    expect(get(mockRouter.metadata, MetaPaths.apiObject)).toBeUndefined();
    expect(get(mockHandler.metadata, MetaPaths.apiOperation)).toEqual(src);
  });

  test('ApiTag', () => {
    const apiTag = useApiTag('tag2');
    apiTag[MetaKeys.metaCallback]?.(mockRouter, mockHandler);
    expect(get(mockRouter.metadata, MetaPaths.apiObject)).toBeUndefined();
    expect(get(mockHandler.metadata, MetaPaths.apiOperation)).toEqual({
      tags: ['tag2'],
    });
  });

  test('ApiSummary', () => {
    const apiSummary = useApiSummary('Some summary');
    apiSummary[MetaKeys.metaCallback]?.(mockRouter, mockHandler);
    expect(get(mockRouter.metadata, MetaPaths.apiObject)).toBeUndefined();
    expect(get(mockHandler.metadata, MetaPaths.apiOperation)).toEqual({
      summary: 'Some summary',
    });
  });

  test('ApiDescription', () => {
    const apiDescription = useApiDescription('Some description');
    apiDescription[MetaKeys.metaCallback]?.(mockRouter, mockHandler);
    expect(get(mockRouter.metadata, MetaPaths.apiObject)).toBeUndefined();
    expect(get(mockHandler.metadata, MetaPaths.apiOperation)).toEqual({
      description: 'Some description',
    });
  });

  test('ApiOperationid', () => {
    const apiOperationid = useApiOperationId('uniq-id');
    apiOperationid[MetaKeys.metaCallback]?.(mockRouter, mockHandler);
    expect(get(mockRouter.metadata, MetaPaths.apiObject)).toBeUndefined();
    expect(get(mockHandler.metadata, MetaPaths.apiOperation)).toEqual({
      operationId: 'uniq-id',
    });
  });

  test('ApiParameter', () => {
    const src = {
      name: 'xyz',
      in: 'path',
      schema: { type: 'string' },
    } as const;
    const apiParameter = useApiParameter(src);
    apiParameter[MetaKeys.metaCallback]?.(mockRouter, mockHandler);
    expect(get(mockRouter.metadata, MetaPaths.apiObject)).toBeUndefined();
    expect(get(mockHandler.metadata, MetaPaths.apiOperation)).toEqual({
      parameters: [src],
    });
  });

  test('ApiRequestbody', () => {
    const src = {
      content: {
        'application/json': {
          schema: { type: 'object', properties: { str: { type: 'string' } } },
        },
      },
    } as const;
    const apiRequestbody = useApiRequestBody(src);
    apiRequestbody[MetaKeys.metaCallback]?.(mockRouter, mockHandler);
    expect(get(mockRouter.metadata, MetaPaths.apiObject)).toBeUndefined();
    expect(get(mockHandler.metadata, MetaPaths.apiOperation)).toEqual({
      requestBody: src,
    });
  });

  test('ApiResponses', () => {
    const src = { 404: { description: 'not found' } };
    const apiResponses = useApiResponses(src);
    apiResponses[MetaKeys.metaCallback]?.(mockRouter, mockHandler);
    expect(get(mockRouter.metadata, MetaPaths.apiObject)).toBeUndefined();
    expect(get(mockHandler.metadata, MetaPaths.apiOperation)).toEqual({
      responses: src,
    });
  });

  test('ApiDeprecated', () => {
    const apiDeprecated = useApiDeprecated();
    apiDeprecated[MetaKeys.metaCallback]?.(mockRouter, mockHandler);
    expect(get(mockRouter.metadata, MetaPaths.apiObject)).toBeUndefined();
    expect(get(mockHandler.metadata, MetaPaths.apiOperation)).toEqual({
      deprecated: true,
    });
  });
});
