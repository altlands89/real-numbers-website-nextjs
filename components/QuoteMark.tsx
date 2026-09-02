/** A single bold, geometric comma-quote glyph in the brand's confident
 *  sans-serif weight — used in pairs (open + the same shape rotated 180°
 *  for close) so a testimonial reads as properly bracketed, not just a
 *  stray mark trailing the last word. Color comes from `currentColor`. */
export default function QuoteMark({
  close = false,
  className,
}: {
  close?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 32"
      width="34"
      height="45"
      fill="none"
      aria-hidden="true"
      className={`quote-mark${close ? " quote-mark--close" : ""}${className ? ` ${className}` : ""}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 16C2 7.16 9.16 0 18 0V6C12.48 6 8 10.48 8 16C8 16.34 8.02 16.67 8.06 17C9.17 16.36 10.53 16 12 16C16.42 16 20 19.58 20 24C20 28.42 16.42 32 12 32C7.58 32 4 28.42 4 24C4 23.5 4.05 23.01 4.14 22.54C2.78 20.79 2 18.5 2 16Z"
        fill="currentColor"
      />
    </svg>
  );
}
