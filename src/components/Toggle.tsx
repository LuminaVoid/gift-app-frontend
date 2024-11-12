import "./Toggle.css";
import { DarkIcon, LightIcon } from "./Icons";

interface ToggleProps {
  name: string;
  onChange: () => void;
  disabled?: boolean;
  checked?: boolean;
}

export default function Toggle({
  name,
  onChange,
  disabled = false,
  checked = false,
}: Readonly<ToggleProps>) {
  return (
    <div className="toggle-container">
      <input
        onChange={onChange}
        disabled={disabled}
        type="checkbox"
        name={name}
        id={`toggle-${name}`}
        checked={checked}
      />
      <label htmlFor={`toggle-${name}`}>
        {name === "theme" && (
          <>
            <LightIcon
              fill={
                checked
                  ? getComputedStyle(document.body).getPropertyValue(
                      "--labelSecondary"
                    )
                  : getComputedStyle(document.body).getPropertyValue("--black")
              }
            />
            <DarkIcon
              fill={
                checked
                  ? getComputedStyle(document.body).getPropertyValue("--white")
                  : getComputedStyle(document.body).getPropertyValue(
                      "--labelSecondary"
                    )
              }
            />
          </>
        )}
        {name === "language" && (
          <>
            <div>EN</div>
            <div>RU</div>
          </>
        )}
      </label>
    </div>
  );
}
