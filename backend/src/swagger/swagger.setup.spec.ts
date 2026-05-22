import { type INestApplication } from '@nestjs/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { describe, expect, it, vi } from 'vitest';
import { createSwaggerDocument } from './swagger-document.factory';
import { setupSwaggerDocumentation } from './swagger.setup';
import { SwaggerDocumentationModule } from './swagger.module';
import { SwaggerPath } from './swagger.constants';

describe('setupSwaggerDocumentation', () => {
  const app = {} as INestApplication;
  const documentObject = { openapi: '3.0.0' };

  it('registers Swagger UI when enabled', () => {
    const createDocument = vi
      .spyOn(SwaggerModule, 'createDocument')
      .mockReturnValue(documentObject as OpenAPIObject);

    const setup = vi.spyOn(SwaggerModule, 'setup').mockImplementation(() => undefined);

    setupSwaggerDocumentation(app, true);

    expect(createDocument).toHaveBeenCalledWith(app, expect.any(Object));
    expect(setup).toHaveBeenCalledWith(SwaggerPath.DOCS, app, document);

    createDocument.mockRestore();
    setup.mockRestore();
  });

  it('skips registration when disabled', () => {
    const createDocument = vi.spyOn(SwaggerModule, 'createDocument');
    const setup = vi.spyOn(SwaggerModule, 'setup');

    setupSwaggerDocumentation(app, false);

    expect(createDocument).not.toHaveBeenCalled();
    expect(setup).not.toHaveBeenCalled();

    createDocument.mockRestore();
    setup.mockRestore();
  });
});

describe('createSwaggerDocument', () => {
  it('builds an OpenAPI document from the Nest app', () => {
    const app = {} as INestApplication;
    const document = { openapi: '3.0.0', info: { title: 'test' } };
    const createDocument = vi
      .spyOn(SwaggerModule, 'createDocument')
      .mockReturnValue(document);

    expect(createSwaggerDocument(app)).toBe(document);
    expect(createDocument).toHaveBeenCalledWith(app, expect.objectContaining({
      info: expect.objectContaining({ title: expect.any(String) }),
    }));

    createDocument.mockRestore();
  });
});

describe('SwaggerDocumentationModule', () => {
  it('delegates setup to setupSwaggerDocumentation', () => {
    const setup = vi
      .spyOn(SwaggerModule, 'setup')
      .mockImplementation(() => undefined);
    vi.spyOn(SwaggerModule, 'createDocument').mockReturnValue({});

    SwaggerDocumentationModule.setup({} as INestApplication, true);
    expect(setup).toHaveBeenCalled();

    setup.mockRestore();
    vi.restoreAllMocks();
  });
});
