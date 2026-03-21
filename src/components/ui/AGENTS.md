# UI Component Patterns

Use these rules for every new component created in `src/components/ui`.

## Exports

- Use named exports only.
- Do not use `default export`.
- Re-export public components from `src/components/ui/index.ts`.

## File Structure

- Keep one component per file when possible.
- Co-locate the component, its variants, and its prop types in the same file.
- Use clear names such as `buttonVariants`, `ButtonProps`, and `Button`.
- When a component has reusable internal regions like header, title, description, footer, label, or value, prefer compound components with separate named exports such as `PanelRoot`, `PanelHeader`, `PanelTitle` instead of packing those regions into props.

## TypeScript

- Extend the native HTML props for the underlying element.
- Prefer `React.ComponentPropsWithoutRef<"element">` or specific native interfaces like `React.ButtonHTMLAttributes<HTMLButtonElement>`.
- When variants exist, combine native props with `VariantProps<typeof componentVariants>`.
- Use `React.forwardRef` for interactive primitives.
- Always set `displayName` after `forwardRef`.
- Mark interactive components with `"use client"` only when required.

## Variants

- Use `tailwind-variants` for visual variants.
- Create and export a `*Variants` constant for each variant-driven component.
- Put shared styles in `base`.
- Use `variants`, `defaultVariants`, and `compoundVariants` when needed.
- Pass `className` directly into the variant function, for example `componentVariants({ className, size, variant })`.
- Do not create a custom `cn` helper.
- When using `tailwind-variants`, pass `className` directly into the variant function instead of wrapping the result with `twMerge`.
- When composing classes manually outside `tailwind-variants`, always use `twMerge` instead of string interpolation, template-literal class concatenation, or `filter(Boolean).join(" ")`.

## Styling

- Use Tailwind utility classes.
- Use `font-sans` for regular interface text and rely on Tailwind's default sans stack.
- Use `font-mono` for monospaced UI text and map it to JetBrains Mono through Tailwind theme variables.
- Do not create custom font utility names like `font-primary`, `font-secondary`, or `font-button`.
- Preserve the dark terminal-like visual language from the Pencil component library when building shared DevRoast UI primitives.
- Follow the existing visual language derived from Pencil selections and current UI tokens.
- Prefer semantic variant names like `primary`, `secondary`, `outline`, `ghost`, `destructive`, `success`.
- Prefer semantic size names like `sm`, `md`, `lg`.
- Keep accessibility states explicit: `focus-visible`, `disabled`, and hover styles.

## Behavior Libraries

- Use Base UI primitives for components with interaction behavior, such as `Switch`, `Dialog`, `Popover`, `Tabs`, and similar controls.
- Keep behavior concerns in the primitive and styling concerns in Tailwind classes plus `tailwind-variants`.

## Server Components

- Keep syntax-highlighted code rendering on the server.
- Use `shiki` for code highlighting.
- Use the `vesper` theme for DevRoast code surfaces unless a different theme is explicitly required.
- Treat `CodeBlock` as a server component by default.
- Use a separate client component such as `CodeEditorInput` for editable code entry; do not turn `CodeBlock` into a client editor.

## Composition

- Use `Panel` as the main reusable surface primitive for cards, analysis blocks, and terminal/code containers.
- Prefer composing complex UI from primitives like `Panel`, `Badge`, `Switch`, `Table`, and `CodeBlock` instead of building feature-specific monoliths too early.
- Prefer named exports for compound components, such as `SwitchRoot`, `SwitchControl`, `SwitchLabel`, instead of namespace patterns like `Switch.Root`.
- Keep only true style or behavior configuration on the root component; move structural content like titles, descriptions, labels, file names, and footer content into subcomponents.

## Accessibility

- Preserve native element behavior by default.
- Set safe defaults for native props when useful, such as `type="button"` for buttons.
- Keep keyboard focus styles visible.
- Do not remove disabled semantics.

## Example Pattern

```tsx
import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const exampleVariants = tv({
  base: "",
  variants: {
    variant: {
      primary: "",
      secondary: "",
    },
    size: {
      sm: "",
      md: "",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export type ExampleProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof exampleVariants>;

export const Example = React.forwardRef<HTMLDivElement, ExampleProps>(
  ({ className, size, variant, ...props }, ref) => {
    return (
      <div
        className={exampleVariants({ className, size, variant })}
        ref={ref}
        {...props}
      />
    );
  },
);

Example.displayName = "Example";
```

## Current Reference

- Use `src/components/ui/button.tsx` for variant-driven primitives.
- Use `src/components/ui/panel.tsx` and `src/components/ui/switch.tsx` for composition-first patterns.
