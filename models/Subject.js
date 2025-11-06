import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    code: String,
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    objectives: [
      {
        type: String,
      },
    ],
    prerequisites: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
    suggested_books: [
      {
        type: String,
      },
    ],
    units: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit',
      },
    ],
    meta: {
      version: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Subject', subjectSchema);
