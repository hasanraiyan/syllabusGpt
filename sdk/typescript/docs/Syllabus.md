
# Syllabus


## Properties

Name | Type
------------ | -------------
`id` | string
`branch` | string
`semester` | number
`subject` | [Subject](Subject.md)

## Example

```typescript
import type { Syllabus } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "branch": null,
  "semester": null,
  "subject": null,
} satisfies Syllabus

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Syllabus
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
