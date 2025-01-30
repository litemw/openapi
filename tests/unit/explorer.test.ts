import { describe, test, expect } from 'bun:test';
import { z } from 'zod';
import { createRouter } from '@litemw/router';
import { oas31 } from 'openapi3-ts';
import {
  exploreApi,
  useApiDescription,
  useApiParameter,
  useApiRequestBody,
  useApiTag,
  useApiTags,
} from '../../lib';
import {
  useBody,
  useFiles,
  useParam,
  useQuery,
  validatePipe,
} from '@litemw/middlewares';

describe('OpenAPI explorer', async () => {
  test('Base openapi operations', () => {
    const schema = {
      openapi: '3.1.0',
      info: {
        version: '1.0.0',
        title: 'OpenAPI title',
      },
      paths: {
        '/test/get': {
          get: {
            responses: {
              '200': {},
            },
            parameters: [
              {
                name: 'query',
                in: 'query',
              },
            ],
            tags: ['Test 1'],
            description: 'Get some data',
          },
        },
        '/test/post': {
          get: {
            responses: {
              '200': {},
            },
            parameters: [],
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      str: {
                        type: 'string',
                      },
                      num: {
                        type: 'integer',
                      },
                    },
                  },
                },
              },
            },
            tags: ['Tag 2'],
            description: 'Post some data',
          },
        },
      },
      tags: [
        {
          name: 'Test 1',
          description: 'some tage description',
        },
        {
          name: 'Tag 2',
        },
      ],
    } as const satisfies oas31.OpenAPIObject;

    const router = createRouter('/test').use(
      useApiTags([
        { name: 'Test 1', description: 'some tage description' },
        { name: 'Tag 2' },
      ]),
    );

    router
      .get('/get')
      .use(useApiTag('Test 1'))
      .use(useApiDescription('Get some data'))
      .use(useApiParameter({ name: 'query', in: 'query' }));

    router
      .get('/post')
      .use(useApiTag('Tag 2'))
      .use(useApiDescription('Post some data'))
      .use(
        useApiRequestBody({
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  str: { type: 'string' },
                  num: { type: 'integer' },
                },
              },
            },
          },
        }),
      );

    const spec = exploreApi(router);
    expect(spec).toEqual(schema);
  });

  test('Metadata exploration', () => {
    const bodySchema = z.object({
      num: z.number().optional(),
      str: z.string().optional(),
    });

    const schema = {
      openapi: '3.1.0',
      info: { version: '1.0.0', title: 'OpenAPI title' },
      paths: {
        'test/{version}/get': {
          get: {
            responses: { '200': {} },
            parameters: [
              { name: 'version', schema: { type: 'string' }, in: 'path' },
              {
                name: 'queryKey',
                schema: { type: 'array', items: { type: 'string' } },
                in: 'query',
              },
            ],
            tags: ['test/:version'],
          },
        },
        'test/{version}/post': {
          get: {
            responses: { '200': {} },
            parameters: [
              { name: 'version', schema: { type: 'string' }, in: 'path' },
            ],
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      num: { type: 'number' },
                      str: { type: 'string' },
                    },
                  },
                },
              },
            },
            tags: ['test/:version'],
          },
        },
        'test/{version}/post-file': {
          get: {
            responses: { '200': {} },
            parameters: [
              { name: 'version', schema: { type: 'string' }, in: 'path' },
            ],
            requestBody: {
              content: {
                'multipart/form-data': {
                  schema: {
                    type: 'object',
                    properties: {
                      someFile: { type: 'string', format: 'binary' },
                    },
                  },
                },
              },
            },
            tags: ['test/:version'],
          },
        },
        'test/{version}/post-file-with-body': {
          get: {
            responses: { '200': {} },
            parameters: [
              { name: 'version', schema: { type: 'string' }, in: 'path' },
            ],
            requestBody: {
              content: {
                'multipart/form-data': {
                  schema: {
                    type: 'object',
                    properties: {
                      someFile: { type: 'string', format: 'binary' },
                      num: { type: 'number' },
                      str: { type: 'string' },
                    },
                  },
                },
              },
            },
            tags: ['test/:version'],
          },
        },
      },
    } as const satisfies oas31.OpenAPIObject;

    const router = createRouter('test/:version').use(useParam('version'));

    router.get('/get').use(useQuery('queryKey'));

    router.get('/post').use(useBody(validatePipe(bodySchema)));

    router.get('/post-file').use(useFiles().single('someFile'));

    router
      .get('/post-file-with-body')
      .use(useFiles().single('someFile'))
      .use(useBody(validatePipe(bodySchema)));

    const spec = exploreApi(router);
    console.log(spec);
    expect(spec).toEqual(schema);
  });
});
