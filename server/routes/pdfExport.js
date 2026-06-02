import express from 'express';
import mongoose from 'mongoose';
import protect from '../middlewares/authMiddleware.js';
import Resume from '../models/Resume.js';
import { generateResumePDF } from '../services/pdfService.js';

const router = express.Router();

router.get('/download/:resumeId', protect, async (req, res) => {
  try {
    const { resumeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).send("Invalid resume ID");
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).send("Resume not found");
    }

    const userId = req.user?.id || req.userId;
    if (resume.userId.toString() !== userId) {
      return res.status(403).send("Access denied");
    }

    let template = req.query.template || "classic";
    if (!["classic", "modern", "minimal"].includes(template)) {
      template = "classic";
    }

    // Map mongoose model to expected data structure for pdfService
    const resumeData = {
      personalInfo: {
        fullName: resume.personal_info?.full_name,
        email: resume.personal_info?.email,
        phone: resume.personal_info?.phone,
        location: resume.personal_info?.location,
        linkedin: resume.personal_info?.linkedin,
        github: resume.personal_info?.github,
      },
      professionalSummary: resume.professional_summary,
      experience: resume.experience?.map(exp => ({
        company: exp.company,
        position: exp.position,
        dates: `${exp.start_date || ''} - ${exp.end_date || (exp.is_current ? 'Present' : '')}`,
        descriptionBullets: exp.description ? [exp.description] : []
      })),
      education: resume.education?.map(edu => ({
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field,
        graduationDate: edu.graduation_date,
        gpa: edu.gpa
      })),
      projects: resume.project?.map(proj => ({
        name: proj.name,
        type: proj.type,
        description: proj.description,
        link: proj.link
      })),
      skills: resume.skills,
      certifications: resume.certification?.map(cert => ({
        name: cert.certificate_name,
        issuer: cert.issuer,
        date: cert.issue_date
      }))
    };

    const pdfBuffer = await generateResumePDF(resumeData, template);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${resume.title || "resume"}-${Date.now()}.pdf"`);
    res.setHeader("Content-Length", pdfBuffer.length);

    console.log(`PDF generated for user: ${userId}, resume: ${resumeId}`);
    
    res.end(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to generate PDF. Please try again.");
  }
});

export default router;
