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
  const { q, branch, semester, tags, skill } = req.query;
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

  res.json(results);
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
    id: 'string',
    branch: 'string',
    semester: 'number',
    subject: {
      code: 'string|null',
      name: 'string',
      description: 'string',
      objectives: 'array<string>',
      prerequisites: 'array<string>',
      units: 'array<{unit:number, title:string, topics:array<string>}>',
      tags: 'array<string>',
      suggested_books: 'array<string>',
      meta: '{version:string}',
    },
  };
  res.json(schema);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Loaded ${syllabi.length} syllabi`);
});
