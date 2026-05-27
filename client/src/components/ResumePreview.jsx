import ModernTemplate from "../assets/templates/ModernTemplate";
import MinimalImageTemplate from "../assets/templates/MinimalImageTemplate";
import MinimalTemplate from "../assets/templates/MinimalTemplate";
import ClassicTemplate from "../assets/templates/ClassicTemplate";
import MinimalistTemplate from "../assets/templates/MinimalistTemplate";
import CreativeVisualTemplate from "../assets/templates/CreativeVisualTemplate";
import CorporateATSTemplate from "../assets/templates/CorporateATSTemplate";
import ModernProTemplate from "../assets/templates/ModernProTemplate";

const ResumePreview = (props) => {
  const { data, template, accentColor, classes = "", isEditable = false, onUpdate = () => {} } = props;

  const renderTemplate = () => {
    const templateProps = { data, accentColor, isEditable, onUpdate };
    switch (template) {
      case "modern":
        return <ModernTemplate {...templateProps} />;
      case "minimal-image":
        return <MinimalImageTemplate {...templateProps} />;
      case "minimal":
        return <MinimalTemplate {...templateProps} />;
      case "minimalist":
        return <MinimalistTemplate {...templateProps} />;
      case "creativeVisual":
        return <CreativeVisualTemplate {...templateProps} />;
      case "corporateATSTemplate":
        return <CorporateATSTemplate {...templateProps} />;
      case "modernProTemplate":
        return <ModernProTemplate {...templateProps} />;
      default:
        return <ClassicTemplate {...templateProps} />;
    }
  };

  return (
    <div className="w-full bg-gray-100">
      <div
        id="resume-preview"
        className={
          "border border-gray-200 print:shadow-none print:border-none" + classes
        }
      >
        {renderTemplate()}
      </div>

      <style jsx>
        {`
          @page {
            size: letter;
            margin: 0;
          }
          @media print {
            html,
            body {
              width: 8.5in;
              height: 11in;
              overflow: hidden;
            }
            body * {
              visibility: hidden;
            }
            #resume-preview,
            #resume-preview * {
              visibility: visible;
            }
            #resume-preview {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: auto;
              margin: 0;
              padding: 0;
              box-shadow: none !important;
              border: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ResumePreview;
