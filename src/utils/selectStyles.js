// utils/selectStyles.js
const selectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#2c2c2e",
    borderColor: "#374151",
    color: "white",
    minHeight: "38px",
    boxShadow: state.isFocused ? "0 0 0 1px #4b5563" : "none",
    "&:hover": { borderColor: "#4b5563" },
  }),
  input: (b) => ({ ...b, color: "white" }),
  menu: (b) => ({ ...b, backgroundColor: "#2c2c2e", color: "white" }),
  option: (b, s) => ({
    ...b,
    backgroundColor: s.isFocused ? "#4b5563" : "#2c2c2e",
    color: "white",
    cursor: "pointer",
  }),
  singleValue: (b) => ({ ...b, color: "white" }),
  multiValue: (b) => ({ ...b, backgroundColor: "#374151" }),
  multiValueLabel: (b) => ({ ...b, color: "white" }),
  placeholder: (b) => ({ ...b, color: "#9ca3af" }),
};
export default selectStyles;
