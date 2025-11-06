import mongoose from 'mongoose';

const unitSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    unit: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    topics: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Unit', unitSchema);
