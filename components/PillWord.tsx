/** Inline solid-pill accent used mid-headline in place of a word — the
 *  signature Tenity-style headline device, reskinned in brand color. */
export default function PillWord({
  color = "var(--red)",
}: {
  color?: string;
}) {
  return (
    <span
      className="v2-pill-word"
      style={{ background: color }}
      aria-hidden="true"
    />
  );
}
