import { createMemo } from "solid-js";
import "./icon.scss";

interface IconProps {
  name: string;
  size?: number;
  style?: Record<string, any>;
  className?: string;
  onClick?: () => void;
}

export function Icon({
  name,
  style = {},
  className = "",
  onClick = () => {},
}: IconProps) {
  const iconElement = createMemo(() => (
    <i
      class={`material-icons ${className}`}
      style={{ ...style }}
      onClick={onClick}
    >
      {name}
    </i>
  ));

  return iconElement();
}
