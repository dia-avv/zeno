import { motion } from "framer-motion";

export default function AnimatedCheckbox({ checked, onClick, ...props }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="qccard-checkboxBtn"
      aria-label={checked ? "Uncheck" : "Check"}
      {...props}
    >
      <motion.div
        className={`qccard-checkbox${checked ? " is-checked" : ""}`}
        whileTap={{ scale: 0.9 }}
      >
        {checked && (
          <motion.svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <path
              d="M3 8L6.5 11.5L13 5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )}
      </motion.div>
    </button>
  );
}
