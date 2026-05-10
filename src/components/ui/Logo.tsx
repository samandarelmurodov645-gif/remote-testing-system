interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="TestPro"
    >
      <defs>
        <linearGradient
          id="tp-logo-bg"
          x1="0" y1="0" x2="40" y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#4338CA" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* Rounded background */}
      <rect width="40" height="40" rx="9" fill="url(#tp-logo-bg)" />

      {/* Letter T — white, slightly transparent, sits behind the bolt */}
      <rect x="8" y="10" width="24" height="4" rx="2" fill="white" fillOpacity="0.78" />
      <rect x="18" y="10" width="4" height="21" rx="2" fill="white" fillOpacity="0.78" />

      {/* Lightning bolt — emerald, slashes through the T */}
      <path
        d="M23 9L14 23H20L16 32L27 18H21L23 9Z"
        fill="#10B981"
      />
    </svg>
  );
}
