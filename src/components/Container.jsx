import clsx from "clsx";

export default function Container({
  children,
  size = "default",
  spacing = "default", // none | small | default | large
  className,
  as: Component = "div",
}) {
  const sizes = {
    narrow: "max-w-3xl",
    default: "max-w-5xl",
    wide: "max-w-6xl",
    full: "max-w-none",
  };

  const spacingMap = {
    none: "",
    small: "py-12",
    default: "py-20",
    large: "py-28",
  };

  return (
    <Component
      className={clsx(
        "mx-auto w-full",
        "px-4 sm:px-6 lg:px-8",
        sizes[size],
        spacingMap[spacing],
        className
      )}
    >
      {children}
    </Component>
  );
}
