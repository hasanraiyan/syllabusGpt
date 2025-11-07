# Syllabus API TypeScript SDK

This SDK is automatically generated from the OpenAPI specification file `openapi.yaml`.

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

## Running the Test

```bash
npx ts-node test.ts
```

## Regenerating the SDK

To regenerate the SDK, run the following command from the root of the repository:

```bash
npx @openapitools/openapi-generator-cli generate -i openai.yaml -g typescript-fetch -o sdk/typescript
```

This will overwrite the existing SDK with a new one based on the latest version of the `openai.yaml` file.
