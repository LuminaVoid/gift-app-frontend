import TonIcon from "../assets/TON-no-bg.svg";
import EthIcon from "../assets/ETH-no-bg.svg";
import UsdtIcon from "../assets/USDT-no-bg.svg";

import "./Button.css";

interface ButtonProps {
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  label: string;
  variant?: "normal" | "text" | "text-small";
  icon?: string;
  disabled?: boolean;
}

const iconNameToIcon: Record<string, string> = {
  TON: TonIcon,
  ETH: EthIcon,
  USDT: UsdtIcon,
};

export default function Button({
  label,
  onClick,
  variant = "normal",
  icon,
  disabled,
}: Readonly<ButtonProps>) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`button-${variant}`}
    >
      {icon && iconNameToIcon[icon] && (
        <img src={iconNameToIcon[icon]} alt={icon} />
      )}
      <span>{label}</span>
    </button>
  );
}
