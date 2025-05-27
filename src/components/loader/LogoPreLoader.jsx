import { useEffect, useState } from "react";
import PropTypes from "prop-types";

// Default (non-classroom) logos
import LogoLight from "../../assets/images/logo-nav.png"; // white logo
import LogoDark from "../../assets/LOGO.png"; // black logo

// Classroom-specific logos
import Logo1 from "../../assets/LOGO-01.png";

export default function LogoPreloader({ isDarkMode, className = "", classroom = false }) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Select appropriate image sources
        const img1 = new Image();
        const img2 = new Image();

        if (classroom) {
            img1.src = Logo1;
            img2.src = LogoDark;
        } else {
            img1.src = LogoLight;
            img2.src = LogoDark;
        }

        let loadedCount = 0;
        const handleLoad = () => {
            loadedCount += 1;
            if (loadedCount === 2) setIsLoaded(true);
        };

        img1.onload = handleLoad;
        img2.onload = handleLoad;
    }, [classroom]);

    // Determine correct logo to show
    const logoSrc = classroom
        ? isDarkMode ? Logo1 : LogoDark
        : isDarkMode ? LogoLight : LogoDark;

    if (!isLoaded) return null; // You can replace with a loader if needed

    return <img src={logoSrc} alt="Logo" className={className} />;
}

LogoPreloader.propTypes = {
    isDarkMode: PropTypes.bool.isRequired,
    className: PropTypes.string,
    classroom: PropTypes.bool,
};
