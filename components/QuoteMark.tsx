/** A large quotation-mark glyph set in the brand typeface (TASA Orbiter
 *  ExtraBold) rather than a hand-drawn SVG shape — real open/close curly
 *  quote characters, so no rotation trick is needed to tell the pair apart.
 *  Color comes from `currentColor`. */
export default function QuoteMark({
  close = false,
  className,
}: {
  close?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`quote-mark${close ? " quote-mark--close" : ""}${className ? ` ${className}` : ""}`}
    >
      {close ? "”" : "“"}
    </span>
  );
}
