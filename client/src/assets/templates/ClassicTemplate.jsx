import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Github,
  ExternalLink,
} from "lucide-react";
import EditableText from "../../components/EditableText";

const ClassicTemplate = ({ data, accentColor, isEditable, onUpdate }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    if (!month || !year) return dateStr;
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const handleUpdate = (field, value) => {
    onUpdate(field, value);
  };

  const handlePersonalInfoUpdate = (key, value) => {
    const updatedPersonalInfo = { ...data.personal_info, [key]: value };
    handleUpdate("personal_info", updatedPersonalInfo);
  };

  return (
    <div className="max-w-4xl mx-auto p-7 bg-white text-gray-800 leading-relaxed shadow-lg">
      {/* Header */}
      <header
        className="text-center mb-1 pb-2 border-b-2"
        style={{ borderColor: accentColor }}
      >
        <h1 className="text-3xl font-bold" style={{ color: accentColor }}>
          <EditableText 
            value={data.personal_info?.full_name} 
            onChange={(val) => handlePersonalInfoUpdate("full_name", val)} 
            placeholder="Your Name" 
            isEditable={isEditable} 
          />
        </h1>
        <p className="uppercase text-zinc-600 font-medium text-xs tracking-widest mb-1">
          <EditableText 
            value={data.personal_info?.profession} 
            onChange={(val) => handlePersonalInfoUpdate("profession", val)} 
            placeholder="Profession" 
            isEditable={isEditable} 
          />
        </p>

        <div className="flex flex-wrap justify-center gap-1 text-sm text-gray-600">
          {isEditable || data.personal_info?.email ? (
            <div className="flex items-center gap-1">
              <Mail className="size-4" />
              <EditableText 
                value={data.personal_info?.email} 
                onChange={(val) => handlePersonalInfoUpdate("email", val)} 
                placeholder="email@example.com" 
                isEditable={isEditable} 
              />
            </div>
          ) : null}
          {isEditable || data.personal_info?.phone ? (
            <div className="flex items-center gap-1">
              <Phone className="size-4" />
              <EditableText 
                value={data.personal_info?.phone} 
                onChange={(val) => handlePersonalInfoUpdate("phone", val)} 
                placeholder="Phone" 
                isEditable={isEditable} 
              />
            </div>
          ) : null}
          {isEditable || data.personal_info?.location ? (
            <div className="flex items-center gap-1">
              <MapPin className="size-4" />
              <EditableText 
                value={data.personal_info?.location} 
                onChange={(val) => handlePersonalInfoUpdate("location", val)} 
                placeholder="Location" 
                isEditable={isEditable} 
              />
            </div>
          ) : null}
        </div>
      </header>

      {/* Professional Summary */}
      {(isEditable || data.professional_summary) && (
        <section className="mb-4 mt-4">
          <h2 className="text-lg font-semibold border-b border-gray-100 mb-2" style={{ color: accentColor }}>
            PROFESSIONAL SUMMARY
          </h2>
          <div className="text-gray-700 leading-relaxed text-sm">
            <EditableText 
              value={data.professional_summary} 
              onChange={(val) => handleUpdate("professional_summary", val)} 
              placeholder="Write a brief professional summary..." 
              multiline={true} 
              isEditable={isEditable} 
            />
          </div>
        </section>
      )}

      {/* Experience */}
      {(isEditable || (data.experience && data.experience.length > 0)) && (
        <section className="mb-4">
          <h2 className="text-lg font-semibold border-b border-gray-100 mb-2" style={{ color: accentColor }}>
            PROFESSIONAL EXPERIENCE
          </h2>

          <div className="space-y-4">
            {data.experience?.map((exp, index) => (
              <div
                key={index}
                className="relative group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      <EditableText 
                        value={exp.position} 
                        onChange={(val) => {
                          const updated = [...data.experience];
                          updated[index] = { ...exp, position: val };
                          handleUpdate("experience", updated);
                        }} 
                        placeholder="Position" 
                        isEditable={isEditable} 
                      />
                    </h3>
                    <p className="text-gray-700 font-medium text-sm">
                      <EditableText 
                        value={exp.company} 
                        onChange={(val) => {
                          const updated = [...data.experience];
                          updated[index] = { ...exp, company: val };
                          handleUpdate("experience", updated);
                        }} 
                        placeholder="Company" 
                        isEditable={isEditable} 
                      />
                    </p>
                  </div>
                  <div className="text-right text-xs text-gray-600">
                    <p>
                      {formatDate(exp.start_date)} -{" "}
                      {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </p>
                  </div>
                </div>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm mt-1">
                  <EditableText 
                    value={exp.description} 
                    onChange={(val) => {
                      const updated = [...data.experience];
                      updated[index] = { ...exp, description: val };
                      handleUpdate("experience", updated);
                    }} 
                    placeholder="Describe your achievements..." 
                    multiline={true} 
                    isEditable={isEditable} 
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {(isEditable || (data.skills && data.skills.length > 0)) && (
        <section className="mb-4">
          <h2 className="text-lg font-semibold border-b border-gray-100 mb-2" style={{ color: accentColor }}>
            CORE SKILLS
          </h2>
          <div className="flex gap-2 flex-wrap text-sm text-gray-700">
            {data.skills?.map((skill, index) => (
              <span key={index} className="flex items-center gap-1">
                • 
                <EditableText 
                  value={skill} 
                  onChange={(val) => {
                    const updated = [...data.skills];
                    updated[index] = val;
                    handleUpdate("skills", updated);
                  }} 
                  placeholder="Skill" 
                  isEditable={isEditable} 
                />
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {(isEditable || (data.education && data.education.length > 0)) && (
        <section className="mb-4">
          <h2 className="text-lg font-semibold border-b border-gray-100 mb-2" style={{ color: accentColor }}>
            EDUCATION
          </h2>

          <div className="space-y-3">
            {data.education?.map((edu, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    <EditableText 
                      value={edu.degree} 
                      onChange={(val) => {
                        const updated = [...data.education];
                        updated[index] = { ...edu, degree: val };
                        handleUpdate("education", updated);
                      }} 
                      placeholder="Degree" 
                      isEditable={isEditable} 
                    />
                  </h3>
                  <p className="text-gray-700 text-sm">
                    <EditableText 
                      value={edu.institution} 
                      onChange={(val) => {
                        const updated = [...data.education];
                        updated[index] = { ...edu, institution: val };
                        handleUpdate("education", updated);
                      }} 
                      placeholder="Institution" 
                      isEditable={isEditable} 
                    />
                  </p>
                </div>
                <div className="text-xs text-gray-600">
                  {formatDate(edu.graduation_date)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ClassicTemplate;
