// --- src/components/SunMascot/RayWrapper.tsx

import type { SVGProps } from "react";

interface RayWrapperProps extends SVGProps<SVGSVGElement> {
  rayNumber: 1 | 2 | 3 | 4;
}

const RayWrapper = ({ rayNumber, ...props }: RayWrapperProps) => {
  // Ray configurations with paths from the actual SVG files and white stroke
  const rayConfigs = {
    1: {
      viewBox: "0 0 300 198",
      path: "M1040 1699 c-68 -13 -146 -56 -200 -110 -170 -170 -158 -438 25 -595 114 -97 883 -666 935 -692 49 -24 66 -27 161 -27 101 0 108 1 181 38 116 57 181 138 214 269 34 133 -13 289 -116 381 -83 75 -884 674 -936 700 -85 43 -170 54 -264 36z",
      transform: "translate(0.000000,198.000000) scale(0.100000,-0.100000)"
    },
    2: {
      viewBox: "0 0 300 199",
      path: "M1325 1866 c-69 -22 -126 -56 -175 -106 -55 -54 -84 -105 -105 -187 -20 -75 -19 -115 3 -199 28 -103 360 -1010 395 -1076 37 -72 110 -141 185 -176 51 -24 69 -27 167 -27 105 0 114 2 177 33 107 53 191 158 218 274 14 65 12 126 -8 198 -27 94 -360 1006 -389 1063 -48 96 -138 171 -242 201 -65 19 -170 20 -226 2z",
      transform: "translate(0.000000,199.000000) scale(0.100000,-0.100000)"
    },
    3: {
      viewBox: "0 0 300 202",
      path: "M1527 1919 c-122 -29 -232 -126 -277 -246 -11 -31 -82 -284 -158 -562 -132 -491 -137 -509 -137 -606 0 -94 2 -105 33 -167 121 -246 431 -307 636 -127 58 51 87 102 120 204 32 104 261 962 276 1040 56 278 -211 530 -493 464z",
      transform: "translate(0.000000,202.000000) scale(0.100000,-0.100000)"
    },
    4: {
      viewBox: "0 0 300 193",
      path: "M1692 1744 c-122 -32 -141 -51 -521 -504 -391 -465 -376 -446 -408 -516 -25 -52 -28 -70 -28 -159 0 -92 3 -105 33 -166 41 -85 128 -168 209 -200 46 -19 77 -23 153 -23 183 -1 206 18 621 514 431 514 429 511 437 650 15 267 -238 474 -496 404z",
      transform: "translate(0.000000,193.000000) scale(0.100000,-0.100000)"
    }
  };

  const config = rayConfigs[rayNumber];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={config.viewBox}
      {...props}
      style={{ opacity: 1 }} // Ensure 100% opacity
    >
      <g transform={config.transform}>
        {/* Background stroke to create cutting effect */}
        <path
          fill="#fbad02"
          stroke="#fef7ed" // Background color (amber-50)
          strokeWidth="200"
          d={config.path}
          opacity="1"
        />
        {/* Main ray path */}
        <path
          fill="#fbad02"
          d={config.path}
          opacity="1"
        />
      </g>
    </svg>
  );
};

export default RayWrapper;