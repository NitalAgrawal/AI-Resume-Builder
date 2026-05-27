import mongoose from "mongoose";

const ResumeVersionSchema = new mongoose.Schema(
  {
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    versionName: { type: String, required: true },
    resumeData: { type: Object, required: true },
  },
  { timestamps: true }
);

const ResumeVersion = mongoose.model("ResumeVersion", ResumeVersionSchema);

export default ResumeVersion;
