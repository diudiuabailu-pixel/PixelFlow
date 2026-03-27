export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <img
      src="/logo.svg"
      alt="PixelFlow"
      width={size}
      height={size}
      className={className}
    />
  );
}
