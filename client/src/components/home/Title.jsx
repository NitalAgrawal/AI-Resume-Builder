const Title = ({ title, description }) => {
  return (
    <div className="text-center mt-4 text-slate-700 max-w-3xl mx-auto flex flex-col items-center">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0E5C49] tracking-tight">{title}</h2>
      <p className="max-w-xl mt-4 text-gray-500 text-sm sm:text-base leading-relaxed">{description}</p>
    </div>
  );
};

export default Title;
