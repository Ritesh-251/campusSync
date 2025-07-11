const ButtonComponents = ({ value, onClick, disabled = false, className = "" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full p-2 rounded-md font-medium transition-all duration-200 ${
      disabled
        ? "bg-teal-300 cursor-not-allowed opacity-70"
        : "bg-teal-600 hover:bg-teal-700 text-white"
    } ${className}`}
  >
    {value}
  </button>
);
export default ButtonComponents;
