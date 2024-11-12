import { IconProps } from "./types";

export const CrossIcon = ({
  width = 16,
  height = 16,
  fill = "black",
}: Readonly<IconProps>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="16.9497"
        y="5.63599"
        width="2"
        height="16"
        rx="1"
        transform="rotate(45 16.9497 5.63599)"
        fill={fill}
      />
      <rect
        x="18.3638"
        y="16.9497"
        width="2"
        height="16"
        rx="1"
        transform="rotate(135 18.3638 16.9497)"
        fill={fill}
      />
    </svg>
  );
};
