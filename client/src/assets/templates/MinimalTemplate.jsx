import EditableText from "../../components/EditableText";

const MinimalTemplate = ({ data, accentColor, isEditable, onUpdate }) => {
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
    <div className="max-w-4xl mx-auto p-7 bg-white text-gray-900 font-light shadow-lg">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-thin mb-2 tracking-wide">
          <EditableText 
            value={data.personal_info?.full_name} 
            onChange={(val) => handlePersonalInfoUpdate("full_name", val)} 
            placeholder="Your Name" 
            isEditable={isEditable} 
          />
        </h1>
        <p className="uppercase text-gray-500 font-medium text-xs tracking-[0.2em] mb-4">
          <EditableText 
            value={data.personal_info?.profession} 
            onChange={(val) => handlePersonalInfoUpdate("profession", val)} 
            placeholder="Profession" 
            isEditable={isEditable} 
          />
        </p>

        <div className="flex flex-wrap gap-4 text-xs text-gray-400 uppercase tracking-widest">
          {isEditable || data.personal_info?.email ? (
            <EditableText 
              value={data.personal_info?.email} 
              onChange={(val) => handlePersonalInfoUpdate("email", val)} 
              placeholder="email@example.com" 
              isEditable={isEditable} 
            />
          ) : null}
          {isEditable || data.personal_info?.phone ? (
            <EditableText 
              value={data.personal_info?.phone} 
              onChange={(val) => handlePersonalInfoUpdate("phone", val)} 
              placeholder="Phone" 
              isEditable={isEditable} 
            />
          ) : null}
          {isEditable || data.personal_info?.location ? (
            <EditableText 
              value={data.personal_info?.location} 
              onChange={(val) => handlePersonalInfoUpdate("location", val)} 
              placeholder="Location" 
              isEditable={isEditable} 
            />
          ) : null}
        </div>
      </header>

      {/* Professional Summary */}
      {(isEditable || data.professional_summary) && (
        <section className="mb-8">
          <h2
            className="text-[10px] uppercase tracking-[0.3em] font-bold mb-3"
            style={{ color: accentColor }}
          >
            Summary
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
          <h2
            className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4"
            style={{ color: accentColor }}
          >
            Experience
          </h2>

          <div className="space-y-6">
            {data.experience?.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-gray-900">
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
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    {formatDate(exp.start_date)} -{" "}
                    {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-2">
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
                <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
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

      {/* Education */}
      {(isEditable || (data.education && data.education.length > 0)) && (
        <section className="mb-8">
          <h2
            className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4"
            style={{ color: accentColor }}
          >
            Education
          </h2>

          <div className="space-y-4">
            {data.education?.map((edu, index) => (
              <div key={index} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-gray-900">
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
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">
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
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  {formatDate(edu.graduation_date)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {(isEditable || (data.skills && data.skills.length > 0)) && (
        <section className="mb-8">
          <h2
            className="text-[10px] uppercase tracking-[0.3em] font-bold mb-3"
            style={{ color: accentColor }}
          >
            Skills
          </h2>
          <div className="text-gray-700 text-sm flex flex-wrap gap-2">
            {data.skills?.map((skill, index) => (
              <span key={index} className="flex items-center gap-2">
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
                {index < data.skills.length - 1 && "•"}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate;
