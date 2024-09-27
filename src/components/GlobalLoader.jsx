import { motion } from "framer-motion";
import { FaBook } from "react-icons/fa";

const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
      <motion.div
        className="relative w-24 h-24"
        animate={{
          rotateY: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-5xl text-blue-600"
          animate={{
            rotateY: [0, -90, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FaBook />
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span className="text-2xl font-bold text-blue-800">Loading...</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GlobalLoader;
