import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";

// controller for enhancing a resume's professional summary
// POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(404).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices[0].message.content;
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for enhancing a resume's job description
// POST: /api/ai/enhance-pro-sum
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be only 1-2 sentences also highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it ATS-friendly. and only return text no options or anything else.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices[0].message.content;
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for uploading a resume to the database
// POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const systemPrompt =
      "You are an expert AI agent to extract date from resume.";

    const userPrompt = `extract data from this resume ${resumeText} Provide data in the following JSON format with no additional text before or after: 
      {
        professional_summary: { type: String, default: "" },
        skills: [{ type: String }],
        personal_info: {
          image: { type: String, default: "" },
          full_name: { type: String, default: "" },
          profession: { type: String, default: "" },
          email: { type: String, default: "" },
          phone: { type: String, default: "" },
          location: { type: String, default: "" },
          linkedin: { type: String, default: "" },
          github: { type: String, default: "" },
          website: { type: String, default: "" },
        },
        experience: [
          {
            company: { type: String },
            position: { type: String },
            start_date: { type: String },
            end_date: { type: String },
            description: { type: String },
            is_current: { type: Boolean },
          },
        ],
        project: [
          {
            name: { type: String },
            type: { type: String },
            description: { type: String },
          },
        ],
        experience: [
          {
            insitution: { type: String },
            degree: { type: String },
            field: { type: String },
            graduation_date: { type: String },
            gpa: { type: String },
          },
        ],
      }
    `;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const extractedData = response.choices[0].message.content;

    const parsedData = JSON.parse(extractedData);

    const newResume = await Resume.create({ userId, title, ...parsedData });

    return res.status(200).json({ resumeId: newResume._id });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// AI Resume Improvement Suggestions
// POST: /api/ai/suggest-improvements
export const suggestImprovements = async (req, res) => {
  try {
    const { resumeData } = req.body;
    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an AI career coach. Analyze the provided resume data and suggest 5-7 specific improvements to make it stand out. Return as a JSON array of strings.",
        },
        { role: "user", content: JSON.stringify(resumeData) },
      ],
      response_format: { type: "json_object" },
    });
    const result = JSON.parse(response.choices[0].message.content);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// AI Project Description Generator
// POST: /api/ai/generate-project-desc
export const generateProjectDescription = async (req, res) => {
  try {
    const { projectName, projectType, techStack } = req.body;
    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "Generate a compelling, ATS-friendly project description (3-4 bullet points) for a resume. Use action verbs and focus on impact. Return as a single string.",
        },
        { role: "user", content: `Project: ${projectName}, Type: ${projectType}, Tech: ${techStack}` },
      ],
    });
    return res.status(200).json({ description: response.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// AI Skill Suggestions
// POST: /api/ai/suggest-skills
export const suggestSkills = async (req, res) => {
  try {
    const { profession, currentSkills } = req.body;
    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "Suggest 10 relevant skills for a professional in the given field that aren't already in their list. Return as a JSON array of strings.",
        },
        { role: "user", content: `Profession: ${profession}, Current Skills: ${currentSkills.join(", ")}` },
      ],
      response_format: { type: "json_object" },
    });
    const result = JSON.parse(response.choices[0].message.content);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Resume Strength & Weakness Analysis
// POST: /api/ai/analyze-strength
export const analyzeResumeStrength = async (req, res) => {
  try {
    const { resumeData } = req.body;
    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "Analyze the resume and provide a list of strengths and weaknesses. Return ONLY JSON: { strengths: [], weaknesses: [] }",
        },
        { role: "user", content: JSON.stringify(resumeData) },
      ],
      response_format: { type: "json_object" },
    });
    const result = JSON.parse(response.choices[0].message.content);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// AI Interview Question Generator
// POST: /api/ai/generate-interview-questions
export const generateInterviewQuestions = async (req, res) => {
  try {
    const { resumeData, jobTitle } = req.body;
    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "Generate 5 behavioral and 5 technical interview questions based on the resume and job title. Return ONLY JSON: { behavioral: [], technical: [] }",
        },
        { role: "user", content: `Job Title: ${jobTitle}, Resume: ${JSON.stringify(resumeData)}` },
      ],
      response_format: { type: "json_object" },
    });
    const result = JSON.parse(response.choices[0].message.content);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
