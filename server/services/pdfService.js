import puppeteer from 'puppeteer';

function buildResumeHTML(resumeData, template) {
  const {
    personalInfo = {},
    professionalSummary = '',
    experience = [],
    education = [],
    projects = [],
    skills = [],
    certifications = []
  } = resumeData || {};

  let experienceHTML = experience.map(exp => `
    <div class="item">
      <div class="item-header">
        <strong>${exp.position}</strong>, ${exp.company}
        <span class="dates">${exp.dates || ''}</span>
      </div>
      <div class="item-body">
        <ul>
          ${(exp.descriptionBullets || []).map(bullet => `<li>${bullet}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');

  let educationHTML = education.map(edu => `
    <div class="item">
      <div class="item-header">
        <strong>${edu.degree} in ${edu.field}</strong>, ${edu.institution}
        <span class="dates">${edu.graduationDate || ''}</span>
      </div>
      ${edu.gpa ? `<div class="item-body">GPA: ${edu.gpa}</div>` : ''}
    </div>
  `).join('');

  let projectsHTML = projects.map(proj => `
    <div class="item">
      <div class="item-header">
        <strong>${proj.name}</strong> (${proj.type})
        ${proj.link ? `<span class="dates"><a href="${proj.link}">${proj.link}</a></span>` : ''}
      </div>
      <div class="item-body">${proj.description || ''}</div>
    </div>
  `).join('');

  let skillsHTML = skills.length > 0 ? `
    <div class="item">
      <div class="item-body">${skills.join(', ')}</div>
    </div>
  ` : '';

  let certsHTML = certifications.map(cert => `
    <div class="item">
      <div class="item-header">
        <strong>${cert.name}</strong>, ${cert.issuer}
        <span class="dates">${cert.date || ''}</span>
      </div>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        @page { size: A4; margin: 0; }
        body {
          margin: 0;
          padding: 40px;
          box-sizing: border-box;
          font-family: 'Georgia', serif;
          color: black;
          line-height: 1.5;
          font-size: 11px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header h1 {
          font-size: 24px;
          margin: 0;
          font-weight: normal;
        }
        .header p {
          color: #444;
          margin: 5px 0 0;
        }
        .section {
          margin-bottom: 15px;
        }
        .section-title {
          font-size: 14px;
          font-weight: bold;
          border-bottom: 1px solid black;
          margin: 0 0 10px 0;
          padding-bottom: 3px;
          text-transform: uppercase;
        }
        .item {
          margin-bottom: 10px;
        }
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .dates {
          color: #444;
        }
        .item-body {
          margin-top: 3px;
        }
        ul {
          margin: 3px 0 0 0;
          padding-left: 20px;
        }
        a {
          color: black;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${personalInfo.fullName || ''}</h1>
        <p>
          ${[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin, personalInfo.github].filter(Boolean).join(' | ')}
        </p>
      </div>

      ${professionalSummary ? `
      <div class="section">
        <h2 class="section-title">Professional Summary</h2>
        <div class="item-body">${professionalSummary}</div>
      </div>
      ` : ''}

      ${experienceHTML ? `
      <div class="section">
        <h2 class="section-title">Experience</h2>
        ${experienceHTML}
      </div>
      ` : ''}

      ${educationHTML ? `
      <div class="section">
        <h2 class="section-title">Education</h2>
        ${educationHTML}
      </div>
      ` : ''}

      ${projectsHTML ? `
      <div class="section">
        <h2 class="section-title">Projects</h2>
        ${projectsHTML}
      </div>
      ` : ''}

      ${skillsHTML ? `
      <div class="section">
        <h2 class="section-title">Skills</h2>
        ${skillsHTML}
      </div>
      ` : ''}

      ${certsHTML ? `
      <div class="section">
        <h2 class="section-title">Certifications</h2>
        ${certsHTML}
      </div>
      ` : ''}
    </body>
    </html>
  `;
}

async function generateResumePDF(resumeData, template = "classic") {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123 });
    
    const html = buildResumeHTML(resumeData, template);
    
    await page.setContent(html, { waitUntil: "networkidle0" });
    
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0px", bottom: "0px", left: "0px", right: "0px" }
    });
    
    return pdfBuffer;
  } catch (error) {
    throw new Error("PDF generation failed: " + error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export { generateResumePDF };

// TEST: node services/pdfService.js
// generateResumePDF({}, "classic").then(buf => {
//   import("fs").then(fs => fs.writeFileSync("test-output.pdf", buf));
//   console.log("PDF generated successfully!");
// });
