# Syllabus GPT

A REST API for accessing engineering syllabus data across various branches and semesters. Built with Express.js and Fuse.js for fuzzy search capabilities.

## Features

- **Search Syllabi**: Fuzzy search across subject names, descriptions, objectives, units, and tags
- **Branch & Semester Filtering**: Get subjects for specific engineering branches and semesters
- **Pagination**: Handle large datasets efficiently
- **Schema Validation**: Well-defined JSON schema for syllabus data
- **Tags & Metadata**: Organized tagging and version control for subjects

## Quick Start

1. Clone the repository:

   ```bash
   git clone https://github.com/hasanraiyan/syllabusGpt.git
   cd syllabusGpt
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   pnpm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. The API will be running at `http://localhost:5000`

## API Endpoints

- `GET /` - Health check
- `GET /api/syllabus` - Get branches, semesters, and subject counts
- `GET /api/syllabus/:branch/:semester` - Get subjects for a branch and semester
- `GET /api/syllabus/subject/:id` - Get a specific subject by ID
- `GET /api/syllabus/search?q=query&branch=branch&semester=semester&tags=tag1,tag2&page=1&limit=20` - Search syllabi
- `GET /api/syllabus/tags` - Get all available tags with counts
- `GET /api/syllabus/schema` - Get the JSON schema for syllabus data
- `GET /api/contributing` - Get contributing guidelines as plain text

## SDK

A TypeScript SDK is available to interact with the API. It is automatically generated from the `openapi.yaml` specification.

For more details on how to use, build, and regenerate the SDK, please see the [SDK README](./sdk/typescript/README.md).

## Data Structure

Syllabus data is organized in the `data/` directory with the following structure:

```
data/
├── cse/
│   ├── sem1/
│   │   ├── subject1.json
│   │   └── subject2.json
│   └── sem2/
│       └── ...
├── ece/
│   └── ...
└── mechanical/
    └── ...
```

Each JSON file represents a single subject and follows this structure:

```json
{
  "id": "unique-subject-id",
  "branch": "cse",
  "semester": 1,
  "subject": {
    "code": "CS101",
    "name": "Introduction to Programming",
    "description": "Basic programming concepts",
    "objectives": ["Understand variables", "Learn loops"],
    "prerequisites": ["Basic math"],
    "units": [
      {
        "unit": 1,
        "title": "Fundamentals",
        "topics": ["Variables", "Data types"]
      }
    ],
    "tags": ["programming", "basics"],
    "suggested_books": ["Book Title by Author"],
    "meta": {
      "version": "1.0"
    }
  }
}
```

## Contributing

We welcome contributions to expand our syllabus database! Here's how to add new syllabus data:

### Adding New Syllabus Data

#### Option 1: Manual Addition

1. **Fork the repository** and create a feature branch:

```bash
   git checkout -b add-[branch]-[semester]-[subject]
```

2. **Locate the correct directory**: Navigate to `data/[branch]/sem[1-8]/`

3. **Create a JSON file**: Use the provided schema (available at `/api/syllabus/schema`). Ensure:

- The `id` is unique across all files
- Branch and semester match the directory structure
  - All required fields are present
  - Tags are relevant and descriptive

4. **Validate your JSON**: Use a JSON validator or test with the API locally

5. **Commit and push**:

```bash
git add .
git commit -m "Add [Subject Name] syllabus for [Branch] Sem [Semester]"
   git push origin add-[branch]-[semester]-[subject]
```

6. **Create a Pull Request**: Provide a clear description of the added content

#### Option 2: Using Syllabus GPT (AI-Assisted)

For an easier contribution process using this AI tool:

1. **Fork the repository**: [https://github.com/hasanraiyan/syllabusGpt](https://github.com/hasanraiyan/syllabusGpt)

2. **Get the latest schema**: Tell the AI "get latest schema" to obtain the current JSON schema format.

3. **Share your syllabus**: Provide your syllabus content to the AI and ask it to generate the syllabus in the specific format required by the schema.

4. **Add the generated syllabus**: Place the AI-generated JSON file in the correct folder (`data/[branch]/sem[1-8]/`) in your forked repository.

5. **Commit and push**:

   ```bash
   git add .
   git commit -m "Add [Subject Name] syllabus for [Branch] Sem [Semester]"
   git push origin main
   ```

6. **Create a Pull Request**: Submit your changes for review.

### Guidelines for Contributors

- **Accuracy**: Ensure all information is correct and up-to-date
- **Completeness**: Include all required fields from the schema
- **Consistency**: Follow existing naming conventions and structure
- **Quality**: Use proper English and clear descriptions
- **Uniqueness**: Avoid duplicates; check existing data first

### Adding New Branches or Semesters

If you need to add a new engineering branch or semester:

1. Create the directory structure under `data/`
2. Add a `.gitkeep` file initially (as done for existing empty dirs)
3. Add syllabus JSON files following the same format
4. Update this README if needed

### Development Setup for Contributors

1. Follow the Quick Start steps above
2. Run tests (if any) and ensure the API loads your new data
3. Use `npm run format` to format your code before committing

## License

ISC License

## Support

For questions or issues, please open a GitHub issue or contact the maintainers.
