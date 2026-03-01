import mongoose from 'mongoose';

const designSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: { type: String, required: true, default: 'Untitled Design' },
    canvasData: { type: Object, required: true, default: {} },
    thumbnailUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Design', designSchema);