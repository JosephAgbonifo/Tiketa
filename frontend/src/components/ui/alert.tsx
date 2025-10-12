"use client";
import { useEffect, useState } from "react";

export default function Alert({
  type,
  title,
  text,
}: {
  type: string;
  title: string;
  text: string;
}) {
  const [load, setLoad] = useState<number>(100);
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    let rafId = 0;
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / 3000); // 3 seconds
      const remaining = Math.round(100 * (1 - progress));
      setLoad(remaining);

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setVisible(false);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, []);

  if (!visible) return null;

  // ✅ Use explicit Tailwind-safe color maps
  const colorMap = {
    success: "text-green-600 bg-green-500",
    warning: "text-yellow-600 bg-yellow-500",
    primary: "text-blue-600 bg-blue-500",
  };

  const color = colorMap[type as keyof typeof colorMap] || colorMap.primary;

  return (
    <div className="fixed top-6 left-0 w-full flex items-center justify-center z-50">
      <div
        className="relative w-[300px] rounded-md shadow-lg bg-white border border-gray-200 p-3 transition-all hover:border-gray-300"
        onClick={() => setVisible(false)} // manual close
      >
        <p className={`${color.split(" ")[0]} text-md font-bold mb-2`}>
          {title}
        </p>
        <p className="text-justify text-sm text-gray-700 mb-2">{text}</p>

        <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
          <div
            className={`${
              color.split(" ")[1]
            } h-full transition-all duration-100`}
            style={{ width: `${load}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
