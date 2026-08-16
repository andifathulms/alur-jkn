import Link from 'next/link';

export type ButtonSize = 'default' | 'family' | 'caption';

const SIZE_CLASSES: Record<ButtonSize, string> = {
  default: 'min-h-target px-4 text-body',
  family: 'min-h-target-family px-4 text-key',
  caption: 'min-h-target px-3 text-caption',
};

const BASE = 'inline-flex items-center justify-center gap-2 border-2 rounded-md font-medium hover:bg-ink/5';

/**
 * The bordered-button pattern reimplemented identically across ShareCard,
 * PathwayExplorer, FamilyWizard, and the home page — DESIGN.md v3's build
 * order step 7. Sized with the `min-h-target`/`min-h-target-family`
 * tokens, not a hand-written arbitrary value, so buttons built from this
 * primitive never show up in tokens:check.
 */
export function buttonClassName({
  size = 'default',
  pressed = false,
  className = '',
}: {
  size?: ButtonSize;
  pressed?: boolean;
  className?: string;
}): string {
  const tone = pressed ? 'border-ink bg-ink text-paper hover:bg-ink' : 'border-ink';
  return `${BASE} ${SIZE_CLASSES[size]} ${tone} ${className}`.trim();
}

export function Button({
  size,
  pressed,
  className,
  ...rest
}: {
  size?: ButtonSize;
  pressed?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...rest} className={buttonClassName({ size, pressed, className })} />;
}

export function LinkButton({
  size,
  pressed,
  className,
  href,
  ...rest
}: {
  href: string;
  size?: ButtonSize;
  pressed?: boolean;
  className?: string;
} & Omit<React.ComponentProps<typeof Link>, 'href' | 'className'>) {
  return <Link {...rest} href={href} className={buttonClassName({ size, pressed, className })} />;
}
