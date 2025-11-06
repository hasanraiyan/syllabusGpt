# Syllabus GPT

A REST API for accessing engineering syllabus data across various branches and semesters. Built with Express.js and Fuse.js for fuzzy search capabilities.

## Features

- **Search Syllabi**: Fuzzy search across subject names, descriptions, objectives, units, and tags
- **Branch & Semester Filtering**: Get subjects for specific engineering branches and semesters
- **Pagination**: Handle large datasets efficiently
- **Schema Validation**: Well-defined JSON schema for syllabus data
- **Tags & Metadata**: Organized tagging and version control for subjects

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (for cloud database) or local MongoDB instance

### Setup

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

3. Set up environment variables:

   Create a `.env` file in the root directory:

   ```env
   # Database (required for API v2)
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/syllabus?retryWrites=true&w=majority

   # JWT Secret (required for authentication)
   JWT_SECRET=your-super-secret-jwt-key-here

   # Server
   PORT=5000
   NODE_ENV=development
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. The API will be running at `http://localhost:5000`

### Database Setup

The application supports two modes:

- **Legacy Mode**: Uses JSON files in `data/` directory (original functionality)
- **API v2 Mode**: Uses MongoDB for user authentication and API key management

For full functionality, set up MongoDB Atlas:

1. Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a database user
3. Whitelist your IP address
4. Get your connection string and update `MONGODB_URI`

## API Endpoints

### Legacy API (JSON Files)

- `GET /` - Health check
- `GET /api/syllabus` - Get branches, semesters, and subject counts
- `GET /api/syllabus/:branch/:semester` - Get subjects for a branch and semester
- `GET /api/syllabus/subject/:id` - Get a specific subject by ID
- `GET /api/syllabus/search?q=query&branch=branch&semester=semester&tags=tag1,tag2&page=1&limit=20` - Search syllabi
- `GET /api/syllabus/tags` - Get all available tags with counts
- `GET /api/syllabus/schema` - Get the JSON schema for syllabus data
- `GET /api/contributing` - Get contributing guidelines as plain text

### API v2 (MongoDB + Authentication)

- `GET /api/v2/syllabus/health` - Service health check
- `GET /api/v2/syllabus` - Get all syllabi with pagination (no auth required)
- `GET /api/v2/syllabus/:id` - Get specific syllabus (no auth required)

#### Authentication

- `POST /api/v2/auth/register` - Register new user
- `POST /api/v2/auth/login` - Login user
- `GET /api/v2/auth/me` - Get current user info

#### API Key Management (JWT Auth Required)

- `GET /api/v2/auth/api-keys` - List user's API keys
- `POST /api/v2/auth/api-keys` - Generate new API key
- `GET /api/v2/auth/api-keys/:id` - Get specific API key
- `DELETE /api/v2/auth/api-keys/:id` - Revoke API key

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

## Deployment

### Render.com Setup

1. **Create a new Web Service** on Render.com
2. **Connect your GitHub repository**
3. **Set environment variables**:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - A secure random string (generate with `openssl rand -base64 32`)
   - `NODE_ENV` - Set to `production`
4. **Set build command**: `npm install`
5. **Set start command**: `npm start`

### Health Check

After deployment, check the service status at:

- `/api/v2/syllabus/health` - MongoDB connection and service health

### Troubleshooting

**MongoDB Connection Issues:**

- Ensure `MONGODB_URI` is set correctly
- Whitelist all IPs (0.0.0.0/0) in MongoDB Atlas for Render
- Check the health endpoint for connection status

**Application Errors:**

- Check Render logs for detailed error messages
- Verify all environment variables are set
- Ensure MongoDB Atlas cluster is running

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
