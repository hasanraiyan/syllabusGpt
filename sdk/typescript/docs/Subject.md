
# Subject


## Properties

Name | Type
------------ | -------------
`code` | string
`name` | string
`description` | string
`objectives` | Array&lt;string&gt;
`prerequisites` | Array&lt;string&gt;
`units` | [Array&lt;SubjectUnitsInner&gt;](SubjectUnitsInner.md)
`tags` | Array&lt;string&gt;
`suggestedBooks` | Array&lt;string&gt;
`meta` | [SubjectMeta](SubjectMeta.md)

## Example

```typescript
import type { Subject } from ''

// TODO: Update the object below with actual values
const example = {
  "code": null,
  "name": null,
  "description": null,
  "objectives": null,
  "prerequisites": null,
  "units": null,
  "tags": null,
  "suggestedBooks": null,
  "meta": null,
} satisfies Subject

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Subject
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
