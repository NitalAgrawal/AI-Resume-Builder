import { Mail, Phone, MapPin, Award, ExternalLink } from "lucide-react";
import EditableText from "../../components/EditableText";

const MinimalImageTemplate = ({ data, accentColor, isEditable, onUpdate }) => {
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
    <div className="max-w-5xl mx-auto bg-white text-zinc-800 shadow-xl overflow-hidden rounded-xl">
      <div className="grid grid-cols-3 divide-x divide-zinc-100">
        <div className="col-span-1 bg-zinc-50/50 flex flex-col items-center py-12 px-8">
          {/* Image */}
          <div className="mb-8">
            {data.personal_info?.image ? (
              <img
                src={data.personal_info.image}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-2xl shadow-2xl ring-4 ring-white"
              />
            ) : (
              <div className="w-32 h-32 bg-white rounded-2xl shadow-lg flex items-center justify-center text-[10px] font-black text-zinc-200 uppercase tracking-widest border border-zinc-100">
                PHOTO
              </div>
            )}
          </div>

          <div className="w-full space-y-12">
            {/* Contact */}
            <section>
              <h2 className="text-[10px] font-black tracking-[0.2em] text-zinc-300 uppercase mb-6">
                Contact
              </h2>
              <div className="space-y-4 text-xs font-bold text-zinc-500">
                {isEditable || data.personal_info?.phone ? (
                  <div className="flex items-center gap-3">
                    <Phone size={12} style={{ color: accentColor }} />
                    <EditableText 
                      value={data.personal_info?.phone} 
                      onChange={(val) => handlePersonalInfoUpdate("phone", val)} 
                      placeholder="Phone" 
                      isEditable={isEditable} 
                    />
                  </div>
                ) : null}
                {isEditable || data.personal_info?.email ? (
                  <div className="flex items-center gap-3">
                    <Mail size={12} style={{ color: accentColor }} />
                    <EditableText 
                      value={data.personal_info?.email} 
                      onChange={(val) => handlePersonalInfoUpdate("email", val)} 
                      placeholder="email@example.com" 
                      isEditable={isEditable} 
                    />
                  </div>
                ) : null}
                {isEditable || data.personal_info?.location ? (
                  <div className="flex items-center gap-3">
                    <MapPin size={12} style={{ color: accentColor }} />
                    <EditableText 
                      value={data.personal_info?.location} 
                      onChange={(val) => handlePersonalInfoUpdate("location", val)} 
                      placeholder="Location" 
                      isEditable={isEditable} 
                    />
                  </div>
                ) : null}
              </div>
            </section>

            {/* Skills */}
            {(isEditable || (data.skills && data.skills.length > 0)) && (
              <section>
                <h2 className="text-[10px] font-black tracking-[0.2em] text-zinc-300 uppercase mb-6">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills?.map((skill, index) => (
                    <div key={index} className="px-3 py-1.5 bg-white border border-zinc-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-600 shadow-sm">
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
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {(isEditable || (data.education && data.education.length > 0)) && (
              <section>
                <h2 className="text-[10px] font-black tracking-[0.2em] text-zinc-300 uppercase mb-6">
                  Education
                </h2>
                <div className="space-y-6">
                  {data.education?.map((edu, index) => (
                    <div key={index}>
                      <p className="text-xs font-black text-zinc-800 uppercase tracking-tight mb-1">
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
                      </p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
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
                      <span className="text-[10px] font-black text-zinc-200 uppercase">{formatDate(edu.graduation_date)}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Right Content */}
        <main className="col-span-2 py-16 px-12 space-y-16">
          <header>
            <h1 className="text-5xl font-black text-zinc-800 uppercase tracking-tighter mb-2">
              <EditableText 
                value={data.personal_info?.full_name} 
                onChange={(val) => handlePersonalInfoUpdate("full_name", val)} 
                placeholder="Your Name" 
                isEditable={isEditable} 
              />
            </h1>
            <p className="text-lg font-bold text-zinc-400 uppercase tracking-[0.3em]">
              <EditableText 
                value={data.personal_info?.profession} 
                onChange={(val) => handlePersonalInfoUpdate("profession", val)} 
                placeholder="Profession" 
                isEditable={isEditable} 
              />
            </p>
          </header>

          {/* Summary */}
          {(isEditable || data.professional_summary) && (
            <section>
              <h2
                className="text-[10px] font-black tracking-[0.3em] uppercase mb-8 text-zinc-200 flex items-center gap-4"
              >
                Profile
                <span className="h-px bg-zinc-100 flex-grow" />
              </h2>
              <div className="text-sm leading-relaxed text-zinc-600 font-medium">
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
            <section>
              <h2
                className="text-[10px] font-black tracking-[0.3em] uppercase mb-8 text-zinc-200 flex items-center gap-4"
              >
                Experience
                <span className="h-px bg-zinc-100 flex-grow" />
              </h2>
              <div className="space-y-12">
                {data.experience?.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-baseline mb-4">
                      <h3 className="text-xl font-black text-zinc-800 uppercase tracking-tight">
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
                      <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest bg-zinc-50 px-3 py-1 rounded-full whitespace-nowrap">
                        {formatDate(exp.start_date)} -{" "}
                        {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </span>
                    </div>
                    <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: accentColor }}>
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
                    <div className="text-sm text-zinc-600 leading-relaxed font-medium">
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

          {/* Projects */}
          {(isEditable || (data.project && data.project.length > 0)) && (
            <section>
              <h2
                className="text-[10px] font-black tracking-[0.3em] uppercase mb-8 text-zinc-200 flex items-center gap-4"
              >
                Projects
                <span className="h-px bg-zinc-100 flex-grow" />
              </h2>
              <div className="space-y-12">
                {data.project?.map((proj, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-baseline mb-4">
                      <h3 className="text-lg font-black text-zinc-800 uppercase tracking-tight">
                        <EditableText 
                          value={proj.name} 
                          onChange={(val) => {
                            const updated = [...data.project];
                            updated[index] = { ...proj, name: val };
                            handleUpdate("project", updated);
                          }} 
                          placeholder="Project Name" 
                          isEditable={isEditable} 
                        />
                      </h3>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-500 transition-colors">
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                    <div className="text-sm text-zinc-600 leading-relaxed font-medium">
                      <EditableText 
                        value={proj.description} 
                        onChange={(val) => {
                          const updated = [...data.project];
                          updated[index] = { ...proj, description: val };
                          handleUpdate("project", updated);
                        }} 
                        placeholder="Project description..." 
                        multiline={true} 
                        isEditable={isEditable} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certification */}
          {(isEditable || (data.certification && data.certification.length > 0)) && (
            <section>
              <h2
                className="text-[10px] font-black tracking-[0.3em] uppercase mb-8 text-zinc-200 flex items-center gap-4"
              >
                Certifications
                <span className="h-px bg-zinc-100 flex-grow" />
              </h2>
              <div className="space-y-6">
                {data.certification?.map((cert, index) => (
                  <div key={index} className="flex gap-3">
                    <Award size={14} className="shrink-0 mt-1" style={{ color: accentColor }} />
                    <div>
                      <h3 className="text-[10px] font-black text-zinc-800 uppercase tracking-tight">
                        <EditableText 
                          value={cert.certificate_name} 
                          onChange={(val) => {
                            const updated = [...data.certification];
                            updated[index] = { ...cert, certificate_name: val };
                            handleUpdate("certification", updated);
                          }} 
                          placeholder="Certification" 
                          isEditable={isEditable} 
                        />
                      </h3>
                      <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">
                        {cert.issuer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default MinimalImageTemplate;
