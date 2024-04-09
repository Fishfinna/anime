import { createMemo } from "solid-js";
import "./icon.scss";

interface IconProps {
  name: string;
  size?: number;
  style?: Record<string, any>;
  className?: string;
}

export function Icon({ name, style = {}, className = "" }: IconProps) {
  const iconElement = createMemo(() => (
    <i class={`material-icons ${className}`} style={{ ...style }}>
      {name}
    </i>
  ));

  return iconElement();
}
