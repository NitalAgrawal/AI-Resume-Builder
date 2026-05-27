import EditableText from "../../components/EditableText";

const MinimalistTemplate = ({ data, accentColor, isEditable, onUpdate }) => {
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
    <div className="max-w-4xl mx-auto p-7 bg-white text-gray-800 leading-relaxed shadow-lg">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-light mb-1" style={{ color: accentColor }}>
          <EditableText 
            value={data.personal_info?.full_name} 
            onChange={(val) => handlePersonalInfoUpdate("full_name", val)} 
            placeholder="Your Name" 
            isEditable={isEditable} 
          />
        </h1>
        <p className="text-sm text-zinc-500 font-medium tracking-wide mb-4">
          <EditableText 
            value={data.personal_info?.profession} 
            onChange={(val) => handlePersonalInfoUpdate("profession", val)} 
            placeholder="Profession" 
            isEditable={isEditable} 
          />
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-gray-400 text-xs">
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
            className="font-bold uppercase text-[10px] tracking-widest mb-3"
            style={{ color: accentColor }}
          >
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
          <h2
            className="font-bold uppercase text-[10px] tracking-widest mb-4"
            style={{ color: accentColor }}
          >
            Professional Experience
          </h2>
          <div className="space-y-6">
            {data.experience?.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900">
                    <EditableText 
                      value={exp.position} 
                      onChange={(val) => {
                        const updated = [...data.experience];
                        updated[idx] = { ...exp, position: val };
                        handleUpdate("experience", updated);
                      }} 
                      placeholder="Position" 
                      isEditable={isEditable} 
                    />
                  </h3>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">
                    {formatDate(exp.start_date)} -{" "}
                    {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </div>
                </div>
                <p className="text-gray-500 font-bold text-xs uppercase mb-2">
                  <EditableText 
                    value={exp.company} 
                    onChange={(val) => {
                      const updated = [...data.experience];
                      updated[idx] = { ...exp, company: val };
                      handleUpdate("experience", updated);
                    }} 
                    placeholder="Company" 
                    isEditable={isEditable} 
                  />
                </p>
                <div className="text-gray-700 text-sm leading-relaxed">
                  <EditableText 
                    value={exp.description} 
                    onChange={(val) => {
                      const updated = [...data.experience];
                      updated[idx] = { ...exp, description: val };
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
            className="font-bold uppercase text-[10px] tracking-widest mb-4"
            style={{ color: accentColor }}
          >
            Education
          </h2>
          <div className="space-y-4">
            {data.education?.map((edu, i) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">
                    <EditableText 
                      value={edu.degree} 
                      onChange={(val) => {
                        const updated = [...data.education];
                        updated[i] = { ...edu, degree: val };
                        handleUpdate("education", updated);
                      }} 
                      placeholder="Degree" 
                      isEditable={isEditable} 
                    />
                  </h3>
                  <p className="text-gray-500 font-bold text-[10px] uppercase">
                    <EditableText 
                      value={edu.institution} 
                      onChange={(val) => {
                        const updated = [...data.education];
                        updated[i] = { ...edu, institution: val };
                        handleUpdate("education", updated);
                      }} 
                      placeholder="Institution" 
                      isEditable={isEditable} 
                    />
                  </p>
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase">
                  {formatDate(edu.graduation_date)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {(isEditable || (data.skills && data.skills.length > 0)) && (
        <section className="mb-8">
          <h2
            className="font-bold uppercase text-[10px] tracking-widest mb-3"
            style={{ color: accentColor }}
          >
            Core Skills
          </h2>
          <div className="flex flex-wrap gap-2 text-xs text-gray-700">
            {data.skills?.map((s, idx) => (
              <div key={idx} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded font-medium">
                <EditableText 
                  value={s} 
                  onChange={(val) => {
                    const updated = [...data.skills];
                    updated[idx] = val;
                    handleUpdate("skills", updated);
                  }} 
                  placeholder="Skill" 
                  isEditable={isEditable} 
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MinimalistTemplate;
