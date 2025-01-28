const PlusSvg = ({ className = "" }) => {
  return (
    <svg className={`${className} || ""`} width="11" height="11" fill="none">
      <circle cx="5.5" cy="5.5" r="2.5" fill="#ada8c4" />
    </svg>
  );
};

export default PlusSvg;
