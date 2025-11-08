import Fuse from 'fuse.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../../data');

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

const syllabi = loadSyllabi(dataDir);

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

export const getSyllabus = () => {
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
  return branches;
};

export const getSubjectById = (id) => {
  return syllabi.find((syl) => syl.id === id);
};

export const getSubjectsByBranchAndSemester = (branch, semester) => {
  return syllabi.filter((syl) => syl.branch === branch && syl.semester == semester);
};

export const searchSyllabus = (query) => {
  const { q, branch, semester, tags, page = 1, limit = 20 } = query;
  let results = syllabi;

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

  if (q) {
    const fuseResults = fuse.search(q);
    results = fuseResults.map((result) => ({
      ...result.item,
      score: result.score,
      matches: result.matches,
    }));
  }

  return results;
};

export const getTags = () => {
  const tagCounts = {};
  syllabi.forEach((syl) => {
    syl.subject.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  return tagCounts;
};
