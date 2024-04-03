import { createMemo } from "solid-js";

interface IconProps {
  name: string;
  size?: number;
  style?: Record<string, any>;
  className?: string;
}

export function Icon({
  name,
  size = 50,
  style = {},
  className = "",
}: IconProps) {
  const iconElement = createMemo(() => (
    <i class={`material-icons ${className}`} style={{ ...style }}>
      {name}
    </i>
  ));

  return iconElement();
}
