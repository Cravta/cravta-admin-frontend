import { motion } from "framer-motion";
import Image from "../../assets/design.svg"

const ScreenLoader = () => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        >
            {/* Rotating image */}
            <motion.img
                src={Image}
                alt="Loading..."
                className="w-32 h-32"
                animate={{ rotate: [0, 360] }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
        </div>
    );
};

export default ScreenLoader;
