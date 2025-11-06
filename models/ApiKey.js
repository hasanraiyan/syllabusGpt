import mongoose from 'mongoose';

const apiKeySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    permissions: [
      {
        type: String,
        enum: ['read', 'write', 'admin'],
        default: ['read'],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('ApiKey', apiKeySchema);
