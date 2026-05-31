import mongoose from "mongoose";

const CoverLetterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: false,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    tone: {
      type: String,
      enum: ["professional", "friendly", "confident"],
      default: "professional",
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "Untitled Cover Letter",
    },
  },
  {
    timestamps: true,
  }
);

const CoverLetter = mongoose.model("CoverLetter", CoverLetterSchema);

export default CoverLetter;
