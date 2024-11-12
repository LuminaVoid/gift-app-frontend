import "./Text.css";
import { PropsWithChildren } from "react";

interface TextProps {
  type?: "title" | "subtitle" | "footnote" | "bigText";
  color?: "textSecondary" | "labelDate"; // default text color if undefined
  style?: React.CSSProperties;
}

export const Text = ({
  type,
  color,
  style,
  children,
}: Readonly<PropsWithChildren<TextProps>>) => {
  if (type === "title") {
    return (
      <h1 style={style} className={color}>
        {children}
      </h1>
    );
  }
  if (type === "subtitle") {
    return (
      <h2 style={style} className={color}>
        {children}
      </h2>
    );
  }
  if (type === "footnote") {
    return (
      <div style={style} className={`footnote ${color}`}>
        {children}
      </div>
    );
  }
  if (type === "bigText") {
    return (
      <div style={style} className={`bigText ${color}`}>
        {children}
      </div>
    );
  }
  return (
    <div style={style} className={`defaultText ${color}`}>
      {children}
    </div>
  );
};
