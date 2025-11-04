import express from 'express';
import cors from 'cors';
import Fuse from 'fuse.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Load syllabus data
const dataDir = path.join(__dirname, 'data');
const syllabi = loadSyllabi(dataDir);

// Initialize Fuse for search
const fuse = new Fuse(syllabi, {
  keys: [
    'subject.name',
    'subject.description',
    'subject.objectives',
    'subject.units.title',
    'subject.units.topics',
    'subject.tags',
    'subject.suggested_books',
  ],
  threshold: 0.4,
  includeScore: true,
  includeMatches: true,
});

// Helper function to load syllabi from JSON files
function loadSyllabi(dir) {
  const syllabi = [];
  function readDir(currentDir) {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        readDir(filePath);
      } else if (file.endsWith('.json')) {
        try {
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          syllabi.push(data);
        } catch (err) {
          console.error(`Error loading ${filePath}:`, err);
        }
      }
    }
  }
  readDir(dir);
  return syllabi;
}

// Routes

// Root
app.get('/', (req, res) => {
  res.json({ message: 'Syllabus API is running' });
});

// Get branches, semesters, subject counts
app.get('/api/syllabus', (req, res) => {
  const branches = {};
  syllabi.forEach((syl) => {
    if (!branches[syl.branch]) {
      branches[syl.branch] = {};
    }
    if (!branches[syl.branch][syl.semester]) {
      branches[syl.branch][syl.semester] = 0;
    }
    branches[syl.branch][syl.semester]++;
  });
  res.json(branches);
});

// Get subjects for branch and semester
app.get('/api/syllabus/:branch/:semester', (req, res) => {
  const { branch, semester } = req.params;
  const subjects = syllabi.filter((syl) => syl.branch === branch && syl.semester == semester);
  res.json(subjects);
});

// Get single subject by id
app.get('/api/syllabus/subject/:id', (req, res) => {
  const { id } = req.params;
  const subject = syllabi.find((syl) => syl.id === id);
  if (!subject) {
    return res.status(404).json({ error: 'Subject not found' });
  }
  res.json(subject);
});

// Search syllabi
app.get('/api/syllabus/search', (req, res) => {
  const { q, branch, semester, tags, skill, page = 1, limit = 20 } = req.query;
  let results = syllabi;

  // Filter by branch and semester
  if (branch) {
    results = results.filter((syl) => syl.branch === branch);
  }
  if (semester) {
    results = results.filter((syl) => syl.semester == semester);
  }
  if (tags) {
    const tagList = tags.split(',');
    results = results.filter((syl) => tagList.some((tag) => syl.subject.tags.includes(tag)));
  }

  // Fuzzy search
  if (q) {
    const fuseResults = fuse.search(q);
    results = fuseResults.map((result) => ({
      ...result.item,
      score: result.score,
      matches: result.matches,
    }));
  }

  // Pagination
  const total = results.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedResults = results.slice(startIndex, endIndex);

  res.json({
    results: paginatedResults,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// Get all tags
app.get('/api/syllabus/tags', (req, res) => {
  const tagCounts = {};
  syllabi.forEach((syl) => {
    syl.subject.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  res.json(tagCounts);
});

// Get schema
app.get('/api/syllabus/schema', (req, res) => {
  const schema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      branch: { type: 'string' },
      semester: { type: 'integer' },
      subject: {
        type: 'object',
        properties: {
          code: { type: ['string', 'null'] },
          name: { type: 'string' },
          description: { type: 'string' },
          objectives: {
            type: 'array',
            items: { type: 'string' },
          },
          prerequisites: {
            type: 'array',
            items: { type: 'string' },
          },
          units: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                unit: { type: 'integer' },
                title: { type: 'string' },
                topics: {
                  type: 'array',
                  items: { type: 'string' },
                },
              },
              required: ['unit', 'title', 'topics'],
            },
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
          },
          suggested_books: {
            type: 'array',
            items: { type: 'string' },
          },
          meta: {
            type: 'object',
            properties: {
              version: { type: 'string' },
            },
            required: ['version'],
          },
        },
        required: [
          'name',
          'description',
          'objectives',
          'prerequisites',
          'units',
          'tags',
          'suggested_books',
          'meta',
        ],
      },
    },
    required: ['id', 'branch', 'semester', 'subject'],
  };
  res.json(schema);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Loaded ${syllabi.length} syllabi`);
});
