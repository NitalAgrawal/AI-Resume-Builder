import express from "express";
import axios from "axios";
import protect from "../middlewares/authMiddleware.js";
import CoverLetter from "../models/CoverLetter.js";

const router = express.Router();

router.post("/generate", protect, async (req, res) => {
  try {
    const { resumeData, jobTitle, companyName, jobDescription, tone = "professional" } = req.body;

    // Validate presence of required fields
    if (!resumeData) {
      return res.status(400).json({ error: "Missing required field: resumeData" });
    }
    if (!jobTitle) {
      return res.status(400).json({ error: "Missing required field: jobTitle" });
    }
    if (!companyName) {
      return res.status(400).json({ error: "Missing required field: companyName" });
    }
    if (!jobDescription) {
      return res.status(400).json({ error: "Missing required field: jobDescription" });
    }

    // Validate resumeData internal structure (personal_info, professional_summary, experience, skills, education)
    // The request mentions "object containing personal_info, professional_summary, experience, skills, education"
    const requiredResumeFields = ["personal_info", "professional_summary", "experience", "skills", "education"];
    for (const field of requiredResumeFields) {
      if (resumeData[field] === undefined) {
        return res.status(400).json({ error: `Missing required field within resumeData: ${field}` });
      }
    }

    // Validate tone
    const validTones = ["professional", "friendly", "confident"];
    const selectedTone = validTones.includes(tone) ? tone : "professional";

    // Build the prompts
    const systemPrompt = `You are a professional resume writer and career coach. Your goal is to write a tailored, ATS-friendly, and highly compelling cover letter that showcases how the candidate's skills and experience match the target job description. The cover letter must follow the requested tone, be structured professionally (include contact info at the top if provided, standard salutation, introductory paragraph, body paragraphs highlighting matching achievements, and a strong closing with a call to action), and use the candidate's actual resume data. Do not invent details that are not in the resume. Output only the cover letter content.`;

    const userPrompt = `
Generate a cover letter for the following job application:
- Target Job Title: ${jobTitle}
- Company Name: ${companyName}
- Target Job Description:
${jobDescription}

Candidate Resume Data:
- Personal Info: ${JSON.stringify(resumeData.personal_info, null, 2)}
- Professional Summary: ${resumeData.professional_summary}
- Experience: ${JSON.stringify(resumeData.experience, null, 2)}
- Skills: ${Array.isArray(resumeData.skills) ? resumeData.skills.join(", ") : JSON.stringify(resumeData.skills)}
- Education: ${JSON.stringify(resumeData.education, null, 2)}

Requested Tone: ${selectedTone}

Instructions:
1. Match the candidate's skills, accomplishments, and experience directly to the requirements in the job description.
2. Keep the formatting clean, professional, and ATS-friendly.
3. Write in a ${selectedTone} tone.
4. Do not invent any professional accomplishments or qualifications not listed in the resume.
5. Return ONLY the final cover letter text. Do not include any introductory or concluding conversational filler (e.g. "Here is your cover letter:").
`;

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not defined");
    }

    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      },
      {
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
      }
    );

    if (
      response.data &&
      response.data.content &&
      response.data.content[0] &&
      response.data.content[0].text
    ) {
      const coverLetter = response.data.content[0].text;
      return res.status(200).json({ success: true, coverLetter });
    } else {
      throw new Error("Invalid response structure from Anthropic API");
    }
  } catch (error) {
    console.error("Error generating cover letter:", error.response?.data || error.message);
    const errorMessage = error.response?.data?.error?.message || error.message;
    return res.status(500).json({ error: `Failed to generate cover letter: ${errorMessage}` });
  }
});

// 1. POST /api/cover-letter/save
router.post("/save", protect, async (req, res) => {
  try {
    const { jobTitle, companyName, jobDescription, tone, content, resumeId, title } = req.body;
    const userId = req.userId || (req.user && (req.user.id || req.user._id));

    if (!userId) {
      return res.status(401).json({ error: "User unauthorized" });
    }

    const newCoverLetter = new CoverLetter({
      userId,
      resumeId,
      jobTitle,
      companyName,
      jobDescription,
      tone,
      content,
      title,
    });

    const savedDoc = await newCoverLetter.save();
    return res.status(201).json({ success: true, coverLetter: savedDoc });
  } catch (error) {
    console.error("Error saving cover letter:", error);
    return res.status(500).json({ error: `Failed to save cover letter: ${error.message}` });
  }
});

// 2. GET /api/cover-letter/all
router.get("/all", protect, async (req, res) => {
  try {
    const userId = req.userId || (req.user && (req.user.id || req.user._id));
    if (!userId) {
      return res.status(401).json({ error: "User unauthorized" });
    }

    const coverLetters = await CoverLetter.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, coverLetters });
  } catch (error) {
    console.error("Error fetching cover letters:", error);
    return res.status(500).json({ error: `Failed to fetch cover letters: ${error.message}` });
  }
});

// 3. GET /api/cover-letter/:id
router.get("/:id", protect, async (req, res) => {
  try {
    const userId = req.userId || (req.user && (req.user.id || req.user._id));
    if (!userId) {
      return res.status(401).json({ error: "User unauthorized" });
    }

    const coverLetter = await CoverLetter.findById(req.params.id);
    if (!coverLetter) {
      return res.status(404).json({ error: "Cover letter not found" });
    }

    // Verify it belongs to req.user.id, return 403 if not
    if (coverLetter.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Forbidden: You do not own this cover letter" });
    }

    return res.status(200).json({ success: true, coverLetter });
  } catch (error) {
    console.error("Error fetching cover letter:", error);
    return res.status(500).json({ error: `Failed to fetch cover letter: ${error.message}` });
  }
});

// 4. DELETE /api/cover-letter/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const userId = req.userId || (req.user && (req.user.id || req.user._id));
    if (!userId) {
      return res.status(401).json({ error: "User unauthorized" });
    }

    const coverLetter = await CoverLetter.findById(req.params.id);
    if (!coverLetter) {
      return res.status(404).json({ error: "Cover letter not found" });
    }

    // Verify ownership via req.user.id, return 403 if not owned
    if (coverLetter.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Forbidden: You do not own this cover letter" });
    }

    await CoverLetter.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting cover letter:", error);
    return res.status(500).json({ error: `Failed to delete cover letter: ${error.message}` });
  }
});

export default router;

