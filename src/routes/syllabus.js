import express from 'express';
import * as syllabusController from '../controllers/syllabusController.js';

const router = express.Router();

router.get('/', syllabusController.getSyllabus);
router.get('/subject/:id', syllabusController.getSubjectById);
router.get('/search', syllabusController.searchSyllabus);
router.get('/tags', syllabusController.getTags);
router.get('/schema', syllabusController.getSchema);
router.get('/:branch/:semester', syllabusController.getSubjectsByBranchAndSemester);

export default router;
