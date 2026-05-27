import mongoose from "mongoose";

const atsReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    atsScore: {
      type: Number,
      required: true,
    },
    jobDescription: {
      type: String,
    },
    metrics: {
      keywordMatch: { type: Number, default: 0 },
      skillsRelevance: { type: Number, default: 0 },
      experienceRelevance: { type: Number, default: 0 },
      readability: { type: Number, default: 0 },
      formatting: { type: Number, default: 0 },
      actionVerbs: { type: Number, default: 0 },
    },
    missingKeywords: {
      type: [String],
      default: [],
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const ATSReport = mongoose.model("ATSReport", atsReportSchema);

export default ATSReport;
