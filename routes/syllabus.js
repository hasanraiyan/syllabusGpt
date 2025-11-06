import express from 'express';
import Syllabus from '../models/Syllabus.js';
import Subject from '../models/Subject.js';
import Unit from '../models/Unit.js';
import { requireAuth, requirePermission, authenticateApiKey } from '../auth/middleware.js';

const router = express.Router();

// Get all syllabi (no auth required)
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/v2/syllabus - Request received');
    const { branch, semester, page = 1, limit = 20 } = req.query;
    console.log('Query params:', { branch, semester, page, limit });
    let query = {};

    if (branch) query.branch = branch;
    if (semester) query.semester = parseInt(semester);
    console.log('MongoDB query:', query);

    console.log('Fetching syllabi from database...');
    const syllabi = await Syllabus.find(query)
      .populate({
        path: 'subject',
        populate: {
          path: 'units',
        },
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    console.log(`Found ${syllabi.length} syllabi`);

    console.log('Counting total documents...');
    const total = await Syllabus.countDocuments(query);
    console.log(`Total documents: ${total}`);

    console.log('Sending response...');
    res.json({
      syllabi,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
    console.log('Response sent successfully');
  } catch (error) {
    console.error('Error in GET /api/v2/syllabus:', error);
    res.status(500).json({ error: 'Failed to fetch syllabi' });
  }
});

// Get single syllabus
router.get('/:id', async (req, res) => {
  try {
    const syllabus = await Syllabus.findOne({ id: req.params.id }).populate({
      path: 'subject',
      populate: {
        path: 'units',
      },
    });
    if (!syllabus) {
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    res.json(syllabus);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch syllabus' });
  }
});

// Create syllabus (authentication required)
router.post('/', authenticateApiKey, requireAuth, requirePermission('write'), async (req, res) => {
  try {
    const { subject: subjectData, ...syllabusData } = req.body;

    // Create subject
    const subject = new Subject({
      code: subjectData.code,
      name: subjectData.name,
      description: subjectData.description,
      objectives: subjectData.objectives,
      prerequisites: subjectData.prerequisites,
      tags: subjectData.tags,
      suggested_books: subjectData.suggested_books,
      meta: subjectData.meta,
    });
    await subject.save();

    // Create units
    const units = [];
    for (const unitData of subjectData.units) {
      const unit = new Unit({
        subject: subject._id,
        unit: unitData.unit,
        title: unitData.title,
        topics: unitData.topics,
      });
      await unit.save();
      units.push(unit);
    }

    // Create syllabus
    const syllabus = new Syllabus({
      ...syllabusData,
      subject: subject._id,
    });
    await syllabus.save();

    // Populate and return
    await syllabus.populate({
      path: 'subject',
      populate: { path: 'units' },
    });

    res.status(201).json(syllabus);
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ error: 'Syllabus with this ID already exists' });
    } else {
      res.status(400).json({ error: 'Invalid syllabus data' });
    }
  }
});

// Update syllabus (authentication required)
router.put(
  '/:id',
  authenticateApiKey,
  requireAuth,
  requirePermission('write'),
  async (req, res) => {
    try {
      const syllabus = await Syllabus.findOneAndUpdate({ id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });
      if (!syllabus) {
        return res.status(404).json({ error: 'Syllabus not found' });
      }
      res.json(syllabus);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update syllabus' });
    }
  }
);

// Delete syllabus (authentication required)
router.delete(
  '/:id',
  authenticateApiKey,
  requireAuth,
  requirePermission('admin'),
  async (req, res) => {
    try {
      const syllabus = await Syllabus.findOneAndDelete({ id: req.params.id });
      if (!syllabus) {
        return res.status(404).json({ error: 'Syllabus not found' });
      }
      res.json({ message: 'Syllabus deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete syllabus' });
    }
  }
);

// Search syllabi (no auth required)
router.get('/search', async (req, res) => {
  try {
    const { q, branch, semester, tags, page = 1, limit = 20 } = req.query;
    let syllabusQuery = {};

    if (branch) syllabusQuery.branch = branch;
    if (semester) syllabusQuery.semester = parseInt(semester);

    let subjectQuery = {};

    if (tags) {
      const tagList = tags.split(',');
      subjectQuery.tags = { $in: tagList };
    }

    if (q) {
      // Simple text search using regex on subject and units
      const regex = new RegExp(q, 'i');
      subjectQuery.$or = [
        { name: regex },
        { description: regex },
        { objectives: regex },
        { tags: regex },
        { suggested_books: regex },
      ];
    }

    // Find subjects matching the criteria
    let subjectIds = [];
    if (Object.keys(subjectQuery).length > 0) {
      const subjects = await Subject.find(subjectQuery);
      subjectIds = subjects.map((s) => s._id);
      if (subjectIds.length > 0) {
        syllabusQuery.subject = { $in: subjectIds };
      } else {
        // No subjects match, return empty
        return res.json({
          results: [],
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: 0,
            pages: 0,
          },
        });
      }
    }

    const syllabi = await Syllabus.find(syllabusQuery)
      .populate({
        path: 'subject',
        populate: {
          path: 'units',
        },
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Syllabus.countDocuments(syllabusQuery);

    res.json({
      results: syllabi,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
