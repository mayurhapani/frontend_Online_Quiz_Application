import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-75">
      <motion.div
        className="relative w-24 h-24"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-5xl text-blue-600"
          animate={{
            rotate: [0, -360],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <FaSpinner />
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <span className="text-2xl font-bold text-blue-800">Loading...</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GlobalLoader;
