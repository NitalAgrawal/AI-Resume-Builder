import EditableText from "../../components/EditableText";

const CorporateATSTemplate = ({ data, accentColor, isEditable, onUpdate }) => {
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
      <header className="mb-12 border-b-2 pb-8" style={{ borderColor: accentColor }}>
        <h1 className="text-4xl font-bold mb-4 tracking-tight">
          <EditableText 
            value={data.personal_info?.full_name} 
            onChange={(val) => handlePersonalInfoUpdate("full_name", val)} 
            placeholder="Your Name" 
            isEditable={isEditable} 
          />
        </h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold uppercase tracking-wider text-gray-400">
          <EditableText 
            value={data.personal_info?.profession} 
            onChange={(val) => handlePersonalInfoUpdate("profession", val)} 
            placeholder="Profession" 
            isEditable={isEditable} 
            className="text-gray-900"
          />
          {isEditable || data.personal_info?.email ? (
            <div className="flex items-center gap-1">
              •
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
              •
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
              •
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
        <section className="mb-12">
          <h2
            style={{ color: accentColor }}
            className="text-xs font-black uppercase tracking-[0.2em] mb-4"
          >
            Professional Summary
          </h2>
          <div className="text-gray-700 text-sm leading-relaxed max-w-3xl">
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
        <section className="mb-12">
          <h2
            style={{ color: accentColor }}
            className="text-xs font-black uppercase tracking-[0.2em] mb-6"
          >
            Professional Experience
          </h2>
          <div className="space-y-10">
            {data.experience?.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">
                    <EditableText 
                      value={exp.position} 
                      onChange={(val) => {
                        const updated = [...data.experience];
                        updated[i] = { ...exp, position: val };
                        handleUpdate("experience", updated);
                      }} 
                      placeholder="Position" 
                      isEditable={isEditable} 
                    />
                  </h3>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {formatDate(exp.start_date)} -{" "}
                    {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </div>
                </div>
                <div className="text-sm font-bold uppercase tracking-widest mb-4 opacity-75">
                  <EditableText 
                    value={exp.company} 
                    onChange={(val) => {
                      const updated = [...data.experience];
                      updated[i] = { ...exp, company: val };
                      handleUpdate("experience", updated);
                    }} 
                    placeholder="Company" 
                    isEditable={isEditable} 
                  />
                </div>
                <div className="text-gray-700 text-sm leading-relaxed">
                  <EditableText 
                    value={exp.description} 
                    onChange={(val) => {
                      const updated = [...data.experience];
                      updated[i] = { ...exp, description: val };
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

      <div className="grid grid-cols-2 gap-12 border-t pt-10">
        {/* Education */}
        {(isEditable || (data.education && data.education.length > 0)) && (
          <section>
            <h2
              style={{ color: accentColor }}
              className="text-xs font-black uppercase tracking-[0.2em] mb-6"
            >
              Education
            </h2>
            <div className="space-y-8">
              {data.education?.map((edu, i) => (
                <div key={i}>
                  <h3 className="font-bold text-gray-900 uppercase text-xs mb-1">
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
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
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
                  <div className="text-[10px] font-black text-gray-300">
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
            <h2
              style={{ color: accentColor }}
              className="text-xs font-black uppercase tracking-[0.2em] mb-6"
            >
              Expertise
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills?.map((s, idx) => (
                <div key={idx} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded text-xs font-bold uppercase tracking-widest text-gray-600">
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
    </div>
  );
};

export default CorporateATSTemplate;
