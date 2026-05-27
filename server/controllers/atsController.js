import ai from "../configs/ai.js";
import ATSReport from "../models/ATSReport.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");
import mammoth from "mammoth";

// Helper to parse file based on mimetype
const parseResumeFile = async (file) => {
  const { mimetype, buffer } = file;
  if (mimetype === "application/pdf") {
    const data = await pdf(buffer);
    return data.text;
  } else if (
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimetype === "application/msword"
  ) {
    const data = await mammoth.extractRawText({ buffer });
    return data.value;
  }
  throw new Error("Unsupported file type");
};

const getATSAnalysis = async (resumeText, jobDescription) => {
  const systemPrompt = `You are a world-class ATS (Applicant Tracking System) Expert. 
Your goal is to provide a highly realistic and professional ATS score and analysis.
Analyze the resume based on:
1. Keyword Matching (essential tools, technologies, methodologies)
2. Skills Relevance (soft and hard skills)
3. Project Relevance (impact, technologies used)
4. Experience Relevance (role alignment, responsibilities)
5. Action Verbs (use of strong industry-standard verbs)
6. Readability (parsing ease, clear structure)
7. Formatting (professional layout, no complex graphics)
8. Section Structure (Presence of Summary, Experience, Education, etc.)

Return ONLY a valid JSON object with the following structure:
{
  "ats_score": number (0-100),
  "metrics": {
    "keywordMatch": number (0-100),
    "skillsRelevance": number (0-100),
    "experienceRelevance": number (0-100),
    "readability": number (0-100),
    "formatting": number (0-100),
    "actionVerbs": number (0-100)
  },
  "missing_keywords": [string],
  "strengths": [string],
  "weaknesses": [string],
  "suggestions": [string]
}`;

  const userPrompt = `RESUME CONTENT:
${resumeText}

JOB DESCRIPTION:
${jobDescription}`;

  const response = await ai.chat.completions.create({
    model: process.env.OPENAI_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
};

// POST: /api/ats/check (Text-based)
export const checkATS = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    const userId = req.userId;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const analysisResult = await getATSAnalysis(resumeText, jobDescription);

    // Save report to database
    await ATSReport.create({
      userId,
      atsScore: analysisResult.ats_score,
      jobDescription,
      metrics: analysisResult.metrics,
      missingKeywords: analysisResult.missing_keywords,
      strengths: analysisResult.strengths,
      weaknesses: analysisResult.weaknesses,
      suggestions: analysisResult.suggestions,
    });

    return res.status(200).json(analysisResult);
  } catch (error) {
    console.error("ATS Check Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// POST: /api/ats/check-file (File-based)
export const checkATSWithFile = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const file = req.file;
    const userId = req.userId;

    if (!file || !jobDescription) {
      return res.status(400).json({ message: "Missing resume file or job description" });
    }

    const resumeText = await parseResumeFile(file);
    const analysisResult = await getATSAnalysis(resumeText, jobDescription);

    // Save report to database
    await ATSReport.create({
      userId,
      atsScore: analysisResult.ats_score,
      jobDescription,
      metrics: analysisResult.metrics,
      missingKeywords: analysisResult.missing_keywords,
      strengths: analysisResult.strengths,
      weaknesses: analysisResult.weaknesses,
      suggestions: analysisResult.suggestions,
    });

    return res.status(200).json(analysisResult);
  } catch (error) {
    console.error("ATS File Check Error:", error);
    return res.status(500).json({ message: error.message });
  }
};
