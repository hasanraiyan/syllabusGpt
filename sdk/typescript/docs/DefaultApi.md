# DefaultApi

All URIs are relative to *https://syllabusgpt.onrender.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getContributing**](DefaultApi.md#getcontributing) | **GET** /api/contributing | Get contributing guidelines as plain text |
| [**getSchema**](DefaultApi.md#getschema) | **GET** /api/syllabus/schema | Get the syllabus schema |
| [**getSubjectById**](DefaultApi.md#getsubjectbyid) | **GET** /api/syllabus/subject/{id} | Get a single subject by ID |
| [**getSubjectsByBranchAndSemester**](DefaultApi.md#getsubjectsbybranchandsemester) | **GET** /api/syllabus/{branch}/{semester} | Get subjects for a specific branch and semester |
| [**getSyllabus**](DefaultApi.md#getsyllabus) | **GET** /api/syllabus | Get branches, semesters, and subject counts |
| [**getTags**](DefaultApi.md#gettags) | **GET** /api/syllabus/tags | Get all tags with counts |
| [**searchSyllabus**](DefaultApi.md#searchsyllabus) | **GET** /api/syllabus/search | Search syllabi |



## getContributing

> string getContributing()

Get contributing guidelines as plain text

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { GetContributingRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.getContributing();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `text/plain`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Contributing guidelines |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSchema

> GetSchema200Response getSchema()

Get the syllabus schema

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { GetSchemaRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.getSchema();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**GetSchema200Response**](GetSchema200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Schema definition |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSubjectById

> Syllabus getSubjectById(id)

Get a single subject by ID

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { GetSubjectByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    id: id_example,
  } satisfies GetSubjectByIdRequest;

  try {
    const data = await api.getSubjectById(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Syllabus**](Syllabus.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Subject details |  -  |
| **404** | Subject not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSubjectsByBranchAndSemester

> Array&lt;Syllabus&gt; getSubjectsByBranchAndSemester(branch, semester)

Get subjects for a specific branch and semester

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { GetSubjectsByBranchAndSemesterRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    branch: branch_example,
    // number
    semester: 56,
  } satisfies GetSubjectsByBranchAndSemesterRequest;

  try {
    const data = await api.getSubjectsByBranchAndSemester(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **branch** | `string` |  | [Defaults to `undefined`] |
| **semester** | `number` |  | [Defaults to `undefined`] |

### Return type

[**Array&lt;Syllabus&gt;**](Syllabus.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of subjects |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSyllabus

> { [key: string]: { [key: string]: number; }; } getSyllabus()

Get branches, semesters, and subject counts

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { GetSyllabusRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.getSyllabus();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

**{ [key: string]: { [key: string]: number; }; }**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Branches with semester counts |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getTags

> GetTags200Response getTags()

Get all tags with counts

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { GetTagsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.getTags();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**GetTags200Response**](GetTags200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Tag counts |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## searchSyllabus

> SearchSyllabus200Response searchSyllabus(q, branch, semester, tags, skill, page, limit)

Search syllabi

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { SearchSyllabusRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string | Search query (optional)
    q: q_example,
    // string (optional)
    branch: branch_example,
    // number (optional)
    semester: 56,
    // string | Comma-separated tags (optional)
    tags: tags_example,
    // string (optional)
    skill: skill_example,
    // number | Page number for pagination (optional)
    page: 56,
    // number | Number of results per page (optional)
    limit: 56,
  } satisfies SearchSyllabusRequest;

  try {
    const data = await api.searchSyllabus(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **q** | `string` | Search query | [Optional] [Defaults to `undefined`] |
| **branch** | `string` |  | [Optional] [Defaults to `undefined`] |
| **semester** | `number` |  | [Optional] [Defaults to `undefined`] |
| **tags** | `string` | Comma-separated tags | [Optional] [Defaults to `undefined`] |
| **skill** | `string` |  | [Optional] [Defaults to `undefined`] |
| **page** | `number` | Page number for pagination | [Optional] [Defaults to `1`] |
| **limit** | `number` | Number of results per page | [Optional] [Defaults to `20`] |

### Return type

[**SearchSyllabus200Response**](SearchSyllabus200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Paginated search results |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
