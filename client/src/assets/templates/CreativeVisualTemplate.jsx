import EditableText from "../../components/EditableText";

const CreativeVisualTemplate = ({ data, accentColor, isEditable, onUpdate }) => {
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
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-black mb-2 tracking-tight uppercase" style={{ color: accentColor }}>
          <EditableText 
            value={data.personal_info?.full_name} 
            onChange={(val) => handlePersonalInfoUpdate("full_name", val)} 
            placeholder="Your Name" 
            isEditable={isEditable} 
          />
        </h1>
        <p className="text-lg font-medium text-gray-500 uppercase tracking-widest">
          <EditableText 
            value={data.personal_info?.profession} 
            onChange={(val) => handlePersonalInfoUpdate("profession", val)} 
            placeholder="Profession" 
            isEditable={isEditable} 
          />
        </p>
      </header>

      <div className="flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-widest text-gray-400 mb-12">
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

      <div className="grid grid-cols-3 gap-12">
        <div className="col-span-2 space-y-12">
          {/* Experience */}
          {(isEditable || (data.experience && data.experience.length > 0)) && (
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-8 flex items-center gap-4">
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs" style={{ background: accentColor }}>01</span>
                Experience
              </h2>
              <div className="space-y-10">
                {data.experience?.map((exp, idx) => (
                  <div key={idx} className="relative pl-8 border-l-2 border-gray-100">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white" style={{ background: accentColor }} />
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
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
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                        {formatDate(exp.start_date)} -{" "}
                        {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </span>
                    </div>
                    <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: accentColor }}>
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
                    <div className="text-gray-600 text-sm leading-relaxed">
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

          {/* Professional Summary */}
          {(isEditable || data.professional_summary) && (
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-4">
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs" style={{ background: accentColor }}>02</span>
                About Me
              </h2>
              <div className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100">
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
        </div>

        <div className="space-y-12">
          {/* Skills */}
          {(isEditable || (data.skills && data.skills.length > 0)) && (
            <section>
              <h2 className="text-lg font-black uppercase tracking-tight mb-6" style={{ color: accentColor }}>
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills?.map((s, idx) => (
                  <div key={idx} className="px-4 py-2 bg-white border-2 border-gray-50 rounded-xl text-xs font-bold text-gray-700 shadow-sm">
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

          {/* Education */}
          {(isEditable || (data.education && data.education.length > 0)) && (
            <section>
              <h2 className="text-lg font-black uppercase tracking-tight mb-6" style={{ color: accentColor }}>
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
        </div>
      </div>
    </div>
  );
};

export default CreativeVisualTemplate;
