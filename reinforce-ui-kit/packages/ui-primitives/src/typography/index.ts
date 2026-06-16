import { cva, type VariantProps } from 'class-variance-authority';

export const headingVariants = cva('scroll-m-20 text-foreground', {
  variants: {
    level: {
      display:
        'text-balance font-bold tracking-[-0.045em] [font-size:clamp(2.75rem,6vw,5.5rem)] leading-[0.95]',
      h1: 'text-4xl font-bold tracking-[-0.03em] text-balance lg:text-5xl',
      'h1-compact': 'text-3xl font-bold tracking-[-0.03em] text-balance lg:text-4xl',
      h2: 'border-b pb-2 text-3xl font-semibold tracking-[-0.025em] text-balance first:mt-0',
      h3: 'text-2xl font-semibold tracking-tight text-balance',
      h4: 'text-xl font-semibold tracking-tight',
      h5: 'text-lg font-semibold tracking-tight',
      h6: 'text-base font-semibold tracking-tight',
    },
  },
  defaultVariants: { level: 'h1' },
});

export type HeadingVariants = VariantProps<typeof headingVariants>;

export const textVariants = cva('', {
  variants: {
    variant: {
      lead: 'text-xl text-muted-foreground text-pretty',
      subtitle: 'text-base text-muted-foreground text-pretty md:text-lg',
      body: 'leading-7 text-pretty [&:not(:first-child)]:mt-6',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-muted-foreground',
      mono: 'font-mono text-sm',
      numeric: 'font-mono text-sm tabular-nums tracking-tight',
      'numeric-amount':
        'font-mono tabular-nums font-semibold tracking-[-0.02em] [font-size:clamp(1.75rem,5vw,2.5rem)] leading-none',
      'numeric-display':
        'font-mono tabular-nums font-medium tracking-[-0.02em] [font-size:clamp(2rem,4.5vw,3.5rem)] leading-none',
      'numeric-hero':
        'font-mono tabular-nums font-medium tracking-[-0.04em] [font-size:clamp(2.5rem,8.5cqi,5rem)] leading-none',
      'numeric-hero-unit':
        'font-mono tabular-nums font-medium tracking-[-0.04em] [font-size:clamp(1.5rem,4.5cqi,3rem)] leading-none text-muted-foreground',
    },
  },
  defaultVariants: { variant: 'body' },
});

export type TextVariants = VariantProps<typeof textVariants>;

export const inlineCodeClass =
  'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold';
