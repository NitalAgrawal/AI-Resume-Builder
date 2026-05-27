import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  enhanceJobDescription,
  enhanceProfessionalSummary,
  uploadResume,
  suggestImprovements,
  generateProjectDescription,
  suggestSkills,
  analyzeResumeStrength,
  generateInterviewQuestions,
} from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.post("/enhance-pro-sum", protect, enhanceProfessionalSummary);
aiRouter.post("/enhance-job-desc", protect, enhanceJobDescription);
aiRouter.post("/upload-resume", protect, uploadResume);
aiRouter.post("/suggest-improvements", protect, suggestImprovements);
aiRouter.post("/generate-project-desc", protect, generateProjectDescription);
aiRouter.post("/suggest-skills", protect, suggestSkills);
aiRouter.post("/analyze-strength", protect, analyzeResumeStrength);
aiRouter.post("/generate-interview-questions", protect, generateInterviewQuestions);

export default aiRouter;
