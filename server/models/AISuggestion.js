import mongoose from "mongoose";

const AISuggestionSchema = new mongoose.Schema(
  {
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    suggestions: [
      {
        section: String,
        currentText: String,
        suggestedText: String,
        reason: String,
      },
    ],
    overallFeedback: String,
  },
  { timestamps: true }
);

const AISuggestion = mongoose.model("AISuggestion", AISuggestionSchema);

export default AISuggestion;
