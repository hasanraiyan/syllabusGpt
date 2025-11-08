import * as syllabusService from '../services/syllabusService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getSyllabus = (req, res) => {
  const data = syllabusService.getSyllabus();
  res.json(data);
};

export const getSubjectById = (req, res) => {
  const { id } = req.params;
  const subject = syllabusService.getSubjectById(id);
  if (!subject) {
    return res.status(404).json({ error: 'Subject not found' });
  }
  res.json(subject);
};

export const getSubjectsByBranchAndSemester = (req, res) => {
  const { branch, semester } = req.params;
  const subjects = syllabusService.getSubjectsByBranchAndSemester(branch, semester);
  res.json(subjects);
};

export const searchSyllabus = (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const results = syllabusService.searchSyllabus(req.query);

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
};

export const getTags = (req, res) => {
  const tagCounts = syllabusService.getTags();
  res.json(tagCounts);
};

export const getSchema = (req, res) => {
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
};

export const getContributing = (req, res, next) => {
  try {
    const readmePath = path.join(__dirname, '../../../README.md');
    const readmeContent = fs.readFileSync(readmePath, 'utf8');
    const lines = readmeContent.split('\n');
    const contributingStart = lines.findIndex((line) => line.startsWith('## Contributing'));
    const licenseStart = lines.findIndex((line) => line.startsWith('## License'));
    const contributingLines = lines.slice(contributingStart, licenseStart);
    const contributingText = contributingLines.join('\n').trim();
    res.type('text/plain');
    res.send(contributingText);
  } catch (error) {
    next(error);
  }
};
