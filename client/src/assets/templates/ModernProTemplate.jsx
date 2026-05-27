import {
  Award,
  ExternalLink,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import EditableText from "../../components/EditableText";

const ModernProTemplate = ({ data, accentColor, isEditable, onUpdate }) => {
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
    <div className="max-w-5xl mx-auto bg-white text-zinc-800 shadow-xl m-0 overflow-hidden rounded-xl border border-gray-100">
      <header className="flex bg-gray-50 border-b border-gray-200">
        <div className="w-1/4 shrink-0 px-8 py-10 flex flex-col items-center justify-center border-r border-gray-200/50">
          <div className="w-32 h-32 overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white">
            {data.personal_info?.image ? (
              <img
                src={data.personal_info.image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-white flex items-center justify-center text-xs font-black text-gray-200 uppercase tracking-widest">
                PHOTO
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center w-3/4 px-12 py-10">
          <h1 className="text-5xl font-black text-gray-900 mb-3 tracking-tight uppercase">
            <EditableText 
              value={data.personal_info?.full_name} 
              onChange={(val) => handlePersonalInfoUpdate("full_name", val)} 
              placeholder="Your Name" 
              isEditable={isEditable} 
            />
          </h1>
          <p className="text-xl font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">
            <EditableText 
              value={data.personal_info?.profession} 
              onChange={(val) => handlePersonalInfoUpdate("profession", val)} 
              placeholder="Profession" 
              isEditable={isEditable} 
            />
          </p>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
            {isEditable || data.personal_info?.location ? (
              <div className="flex items-center gap-2">
                <MapPin size={12} style={{ color: accentColor }} />
                <EditableText 
                  value={data.personal_info?.location} 
                  onChange={(val) => handlePersonalInfoUpdate("location", val)} 
                  placeholder="Location" 
                  isEditable={isEditable} 
                />
              </div>
            ) : null}
            {isEditable || data.personal_info?.phone ? (
              <div className="flex items-center gap-2">
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
              <div className="flex items-center gap-2">
                <Mail size={12} style={{ color: accentColor }} />
                <EditableText 
                  value={data.personal_info?.email} 
                  onChange={(val) => handlePersonalInfoUpdate("email", val)} 
                  placeholder="email@example.com" 
                  isEditable={isEditable} 
                />
              </div>
            ) : null}
            {isEditable || data.personal_info?.linkedin ? (
              <div className="flex items-center gap-2">
                <Linkedin size={12} style={{ color: accentColor }} />
                <EditableText 
                  value={data.personal_info?.linkedin} 
                  onChange={(val) => handlePersonalInfoUpdate("linkedin", val)} 
                  placeholder="LinkedIn URL" 
                  isEditable={isEditable} 
                />
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-3 divide-x divide-gray-100">
        <main className="col-span-2 px-12 py-12 space-y-16">
          {(isEditable || data.professional_summary) && (
            <section>
              <h2
                className="text-[10px] font-black tracking-[0.3em] uppercase mb-8 text-gray-300 flex items-center gap-4"
              >
                Profile
                <span className="h-px bg-gray-100 flex-grow" />
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

          {(isEditable || (data.experience && data.experience.length > 0)) && (
            <section>
              <h2
                className="text-[10px] font-black tracking-[0.3em] uppercase mb-10 text-gray-300 flex items-center gap-4"
              >
                Experience
                <span className="h-px bg-gray-100 flex-grow" />
              </h2>
              <div className="space-y-12">
                {data.experience?.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-baseline mb-4">
                      <div>
                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">
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
                        <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: accentColor }}>
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
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full whitespace-nowrap">
                        {formatDate(exp.start_date)} -{" "}
                        {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </span>
                    </div>
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

          {(isEditable || (data.project && data.project.length > 0)) && (
            <section>
              <h2
                className="text-[10px] font-black tracking-[0.3em] uppercase mb-10 text-gray-300 flex items-center gap-4"
              >
                Projects
                <span className="h-px bg-gray-100 flex-grow" />
              </h2>
              <div className="space-y-12">
                {data.project?.map((proj, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-baseline mb-4">
                      <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">
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
        </main>

        <aside className="col-span-1 px-10 py-12 space-y-16 bg-gray-50/50">
          {(isEditable || (data.education && data.education.length > 0)) && (
            <section>
              <h2
                className="text-[10px] font-black tracking-[0.3em] uppercase mb-8 text-gray-300"
              >
                Education
              </h2>
              <div className="space-y-8">
                {data.education?.map((edu, index) => (
                  <div key={index}>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-1">
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
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
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
                    <div className="text-[10px] font-black text-gray-300 uppercase">
                      {formatDate(edu.graduation_date)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(isEditable || (data.skills && data.skills.length > 0)) && (
            <section>
              <h2
                className="text-[10px] font-black tracking-[0.3em] uppercase mb-8 text-gray-300"
              >
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills?.map((s, idx) => (
                  <div key={idx} className="px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-600 shadow-sm">
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

          {(isEditable || (data.certification && data.certification.length > 0)) && (
            <section>
              <h2
                className="text-[10px] font-black tracking-[0.3em] uppercase mb-8 text-gray-300"
              >
                Certifications
              </h2>
              <div className="space-y-6">
                {data.certification?.map((cert, index) => (
                  <div key={index} className="flex gap-3">
                    <Award size={14} className="shrink-0 mt-1" style={{ color: accentColor }} />
                    <div>
                      <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-tight">
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
        </aside>
      </div>
    </div>
  );
};

export default ModernProTemplate;
