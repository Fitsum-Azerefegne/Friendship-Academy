import useReveal from "../../hooks/useReveal";

// Wraps any block of content and fades/slides it in the first time it
// scrolls into view. `delay` (ms) lets siblings stagger. Extra props (e.g.
// onSubmit when used as="form") are forwarded to the underlying element.
export default function Reveal({ children, delay = 0, as: Tag = "div", className = "", ...rest }) {
  const [ref, inView] = useReveal();

  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? "in-view" : ""} ${className}`}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
