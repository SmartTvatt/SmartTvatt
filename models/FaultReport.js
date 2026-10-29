import mongoose from 'mongoose';

const faultReportSchema = new mongoose.Schema(
  {
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    equipment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['reported', 'in_progress', 'resolved'],
      default: 'reported',
    },
  },
  { timestamps: true }
);

export default mongoose.model('FaultReport', faultReportSchema);
