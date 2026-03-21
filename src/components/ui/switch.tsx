"use client";

import { Switch as BaseSwitch } from "@base-ui/react/switch";
import * as React from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

export const switchControlVariants = tv({
  base: [
    "inline-flex h-[22px] w-10 items-center rounded-full p-[3px] transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-base",
    "data-[checked]:justify-end data-[checked]:bg-accent-green",
    "data-[unchecked]:bg-border-subtle data-[disabled]:opacity-50",
  ],
});

export const switchThumbVariants = tv({
  base: [
    "block h-4 w-4 rounded-full transition-colors duration-200",
    "data-[checked]:bg-canvas-base data-[unchecked]:bg-foreground-secondary",
  ],
});

export const switchLabelVariants = tv({
  base: "font-mono text-[12px] transition-colors duration-200",
  variants: {
    checked: {
      true: "text-accent-green",
      false: "text-foreground-secondary",
    },
  },
  defaultVariants: {
    checked: false,
  },
});

type SwitchContextValue = {
  checked: boolean;
  disabled?: boolean;
  id?: string;
  setChecked: (checked: boolean) => void;
};

const SwitchContext = React.createContext<SwitchContextValue | null>(null);

function useSwitchContext() {
  const context = React.useContext(SwitchContext);

  if (!context) {
    throw new Error(
      "Switch compound components must be used within SwitchRoot.",
    );
  }

  return context;
}

export type SwitchRootProps = React.HTMLAttributes<HTMLDivElement> & {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  onCheckedChange?: (checked: boolean) => void;
  readOnly?: boolean;
  required?: boolean;
  value?: string;
};

export const SwitchRoot = React.forwardRef<HTMLDivElement, SwitchRootProps>(
  (
    {
      checked,
      children,
      className,
      defaultChecked = false,
      disabled,
      id,
      name,
      onCheckedChange,
      readOnly,
      required,
      value,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const resolvedId = id ?? generatedId;
    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] =
      React.useState(defaultChecked);
    const resolvedChecked = isControlled ? checked : internalChecked;

    const contextValue = React.useMemo(
      () => ({
        checked: resolvedChecked,
        disabled,
        id: resolvedId,
        setChecked: (nextChecked: boolean) => {
          if (!isControlled) {
            setInternalChecked(nextChecked);
          }

          onCheckedChange?.(nextChecked);
        },
      }),
      [disabled, isControlled, onCheckedChange, resolvedChecked, resolvedId],
    );

    return (
      <SwitchContext.Provider value={contextValue}>
        <div
          className={twMerge("inline-flex items-center gap-3", className)}
          data-disabled={disabled ? "true" : undefined}
          data-name={name}
          data-read-only={readOnly ? "true" : undefined}
          data-required={required ? "true" : undefined}
          data-value={value}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </SwitchContext.Provider>
    );
  },
);

SwitchRoot.displayName = "SwitchRoot";

export type SwitchControlProps = Omit<
  React.ComponentPropsWithoutRef<typeof BaseSwitch.Root>,
  | "checked"
  | "children"
  | "className"
  | "defaultChecked"
  | "id"
  | "onCheckedChange"
> & {
  className?: string;
};

export const SwitchControl = React.forwardRef<
  React.ElementRef<typeof BaseSwitch.Root>,
  SwitchControlProps
>(({ className, ...props }, ref) => {
  const { checked, disabled, id, setChecked } = useSwitchContext();

  return (
    <BaseSwitch.Root
      checked={checked}
      className={switchControlVariants({ className })}
      disabled={disabled}
      id={id}
      onCheckedChange={setChecked}
      ref={ref}
      {...props}
    >
      <SwitchThumb />
    </BaseSwitch.Root>
  );
});

SwitchControl.displayName = "SwitchControl";

export type SwitchThumbProps = Omit<
  React.ComponentPropsWithoutRef<typeof BaseSwitch.Thumb>,
  "className"
> & {
  className?: string;
};

export const SwitchThumb = React.forwardRef<
  React.ElementRef<typeof BaseSwitch.Thumb>,
  SwitchThumbProps
>(({ className, ...props }, ref) => {
  return (
    <BaseSwitch.Thumb
      className={switchThumbVariants({ className })}
      ref={ref}
      {...props}
    />
  );
});

SwitchThumb.displayName = "SwitchThumb";

export type SwitchFieldProps = React.HTMLAttributes<HTMLDivElement>;

export const SwitchField = React.forwardRef<HTMLDivElement, SwitchFieldProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        className={twMerge("inline-flex flex-col gap-1", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  },
);

SwitchField.displayName = "SwitchField";

export type SwitchLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const SwitchLabel = React.forwardRef<HTMLLabelElement, SwitchLabelProps>(
  ({ children, className, ...props }, ref) => {
    const { checked, id } = useSwitchContext();

    return (
      <label
        className={switchLabelVariants({ checked, className })}
        htmlFor={id}
        ref={ref}
        {...props}
      >
        {children}
      </label>
    );
  },
);

SwitchLabel.displayName = "SwitchLabel";

export type SwitchDescriptionProps = React.HTMLAttributes<HTMLDivElement>;

export const SwitchDescription = React.forwardRef<
  HTMLDivElement,
  SwitchDescriptionProps
>(({ children, className, ...props }, ref) => {
  return (
    <div
      className={twMerge("text-xs text-foreground-muted", className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

SwitchDescription.displayName = "SwitchDescription";
