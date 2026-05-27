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

const ModernTemplate = ({ data, accentColor, isEditable, onUpdate }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
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
    <div className="max-w-4xl mx-auto bg-white text-gray-800 shadow-lg">
      {/* Header */}
      <header
        className="px-7 py-8 text-white"
        style={{ backgroundColor: accentColor }}
      >
        <h1 className="text-4xl font-light mb-2">
          <EditableText 
            value={data.personal_info?.full_name} 
            onChange={(val) => handlePersonalInfoUpdate("full_name", val)} 
            placeholder="Your Name" 
            isEditable={isEditable} 
            className="text-white hover:bg-white/10"
          />
        </h1>

        <p className="uppercase text-white/90 font-medium text-sm tracking-widest mb-6">
          <EditableText 
            value={data.personal_info?.profession} 
            onChange={(val) => handlePersonalInfoUpdate("profession", val)} 
            placeholder="Profession" 
            isEditable={isEditable} 
            className="text-white hover:bg-white/10"
          />
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {isEditable || data.personal_info?.email ? (
            <div className="flex items-center gap-2">
              <Mail className="size-4 opacity-75" />
              <EditableText 
                value={data.personal_info?.email} 
                onChange={(val) => handlePersonalInfoUpdate("email", val)} 
                placeholder="email@example.com" 
                isEditable={isEditable} 
                className="text-white hover:bg-white/10"
              />
            </div>
          ) : null}
          {isEditable || data.personal_info?.phone ? (
            <div className="flex items-center gap-2">
              <Phone className="size-4 opacity-75" />
              <EditableText 
                value={data.personal_info?.phone} 
                onChange={(val) => handlePersonalInfoUpdate("phone", val)} 
                placeholder="Phone" 
                isEditable={isEditable} 
                className="text-white hover:bg-white/10"
              />
            </div>
          ) : null}
          {isEditable || data.personal_info?.location ? (
            <div className="flex items-center gap-2">
              <MapPin className="size-4 opacity-75" />
              <EditableText 
                value={data.personal_info?.location} 
                onChange={(val) => handlePersonalInfoUpdate("location", val)} 
                placeholder="Location" 
                isEditable={isEditable} 
                className="text-white hover:bg-white/10"
              />
            </div>
          ) : null}
        </div>
      </header>

      <div className="px-7 py-8">
        {/* Professional Summary */}
        {(isEditable || data.professional_summary) && (
          <section className="mb-8">
            <h2 className="text-xl font-light border-b border-gray-100 mb-4 pb-1 uppercase tracking-tight">
              Professional Summary
            </h2>
            <div className="text-gray-700 text-sm leading-relaxed">
              <EditableText 
                value={data.professional_summary} 
                onChange={(val) => handleUpdate("professional_summary", val)} 
                placeholder="Write your professional summary..." 
                multiline={true} 
                isEditable={isEditable} 
              />
            </div>
          </section>
        )}

        {/* Experience */}
        {(isEditable || (data.experience && data.experience.length > 0)) && (
          <section className="mb-8">
            <h2 className="text-xl font-light border-b border-gray-100 mb-6 pb-1 uppercase tracking-tight">
              Experience
            </h2>

            <div className="space-y-6">
              {data.experience?.map((exp, index) => (
                <div
                  key={index}
                  className="relative pl-6 border-l-2 border-gray-100"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">
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
                      <p
                        className="font-bold text-sm"
                        style={{ color: accentColor }}
                      >
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
                    <div className="text-[10px] uppercase font-bold text-gray-400">
                      {formatDate(exp.start_date)} -{" "}
                      {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </div>
                  </div>
                  <div className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
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

        <div className="grid sm:grid-cols-2 gap-12 mt-8 pt-4 border-t border-gray-50">
          {/* Education */}
          {(isEditable || (data.education && data.education.length > 0)) && (
            <section>
              <h2 className="text-xl font-light border-b border-gray-100 mb-6 pb-1 uppercase tracking-tight">
                Education
              </h2>

              <div className="space-y-6">
                {data.education?.map((edu, index) => (
                  <div key={index}>
                    <h3 className="text-gray-900 font-bold">
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
                    <p style={{ color: accentColor }} className="text-sm font-medium mb-1">
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
                    <div className="text-xs text-gray-400 font-bold uppercase">
                      {formatDate(edu.graduation_date)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {(isEditable || (data.skills && data.skills.length > 0)) && (
            <section>
              <h2 className="text-xl font-light border-b border-gray-100 mb-6 pb-1 uppercase tracking-tight">
                Skills
              </h2>

              <div className="flex flex-wrap gap-2">
                {data.skills?.map((skill, index) => (
                  <div
                    key={index}
                    className="px-3 py-1.5 text-xs font-bold text-white rounded-lg shadow-sm"
                    style={{ backgroundColor: accentColor }}
                  >
                    <EditableText 
                      value={skill} 
                      onChange={(val) => {
                        const updated = [...data.skills];
                        updated[index] = val;
                        handleUpdate("skills", updated);
                      }} 
                      placeholder="Skill" 
                      isEditable={isEditable} 
                      className="text-white hover:bg-black/10"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
