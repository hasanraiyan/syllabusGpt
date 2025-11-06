import mongoose from 'mongoose';
import Syllabus from './models/Syllabus.js';
import Subject from './models/Subject.js';
import Unit from './models/Unit.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/syllabus';

async function migrateData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Syllabus.deleteMany({});
    await Subject.deleteMany({});
    await Unit.deleteMany({});
    console.log('Cleared existing data');

    // Load syllabus data
    const dataDir = path.join(__dirname, 'data');
    const syllabiData = loadSyllabi(dataDir);

    // Migrate data with normalization
    for (const syllabusData of syllabiData) {
      // Create subject
      const subject = new Subject({
        code: syllabusData.subject.code,
        name: syllabusData.subject.name,
        description: syllabusData.subject.description,
        objectives: syllabusData.subject.objectives,
        prerequisites: syllabusData.subject.prerequisites,
        tags: syllabusData.subject.tags,
        suggested_books: syllabusData.subject.suggested_books,
        meta: syllabusData.subject.meta,
        units: [], // will be populated after creating units
      });
      await subject.save();

      // Create units
      const unitIds = [];
      for (const unitData of syllabusData.subject.units) {
        const unit = new Unit({
          subject: subject._id,
          unit: unitData.unit,
          title: unitData.title,
          topics: unitData.topics,
        });
        await unit.save();
        unitIds.push(unit._id);
      }

      // Update subject with unit ids
      subject.units = unitIds;
      await subject.save();

      // Create syllabus
      const syllabus = new Syllabus({
        id: syllabusData.id,
        branch: syllabusData.branch,
        semester: syllabusData.semester,
        subject: subject._id,
      });
      await syllabus.save();
    }

    console.log(`Migrated ${syllabiData.length} syllabi to MongoDB`);

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Helper function to load syllabi from JSON files (same as in index.js)
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

migrateData();
