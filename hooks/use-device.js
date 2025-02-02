import { useState, useEffect } from 'react';

const useDeviceType = () => {
  const [device, setDevice] = useState("desktop");

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (width < 768 && height > width) {
        setDevice("mobile");
      } else if (width < 768 && height < width) {
        setDevice("mobile-landscape");
      } else if (width >= 768 && width < 1024) {
        setDevice("tablet");
      } else {
        setDevice("desktop");
      }
    };

    checkDevice(); // Initial check
    window.addEventListener("resize", checkDevice);
    window.addEventListener("orientationchange", checkDevice); // Listen for orientation change

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("orientationchange", checkDevice); // Clean up listeners
    };
  }, []);

  return device;
};

export default useDeviceType;