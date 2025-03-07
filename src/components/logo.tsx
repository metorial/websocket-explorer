export let Logo = ({
  width,
  height
}: {
  width?: number | string;
  height?: number | string;
}) => (
  <svg
    width={width ?? 30}
    height={height ?? 30}
    viewBox="0 0 56 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1_36)">
      <path d="M27.65 0L55.3 55.3L47.95 70H7.35L0 55.3L27.65 0Z" fill="var(--primary)" />
      <path d="M27.65 25.9L47.95 70H7.35L27.65 25.9Z" fill="#5FADF4" />
    </g>
    <defs>
      <clipPath id="clip0_1_36">
        <rect width="55.3" height="70" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
