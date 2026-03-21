import * as React from "react";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

export const tableVariants = tv({
  base: "w-full border-separate border-spacing-0 border border-border-subtle bg-canvas-base text-left text-sm text-foreground-inverse",
});

export const tableRowVariants = tv({
  base: "border-b border-border-subtle last:border-b-0",
  variants: {
    variant: {
      body: "",
      header: "bg-surface-subtle",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

export const tableCellVariants = tv({
  base: "px-5 py-4 align-top font-mono text-[12px]",
  variants: {
    tone: {
      default: "text-foreground-inverse",
      muted: "text-foreground-secondary",
      score: "font-bold text-accent-red",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});

export type TableProps = React.TableHTMLAttributes<HTMLTableElement>;
export type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>;
export type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;
export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement> &
  VariantProps<typeof tableRowVariants>;
export type TableCellProps = React.ThHTMLAttributes<HTMLTableCellElement> &
  React.TdHTMLAttributes<HTMLTableCellElement> &
  VariantProps<typeof tableCellVariants> & {
    as?: "td" | "th";
  };

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div className="overflow-hidden border border-border-subtle bg-canvas-base">
        <table className={tableVariants({ className })} ref={ref} {...props}>
          {children}
        </table>
      </div>
    );
  },
);

Table.displayName = "Table";

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(({ children, className, ...props }, ref) => {
  return (
    <thead
      className={twMerge("border-b border-border-subtle", className)}
      ref={ref}
      {...props}
    >
      {children}
    </thead>
  );
});

TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  TableBodyProps
>(({ children, className, ...props }, ref) => {
  return (
    <tbody className={className} ref={ref} {...props}>
      {children}
    </tbody>
  );
});

TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ children, className, variant, ...props }, ref) => {
    return (
      <tr
        className={tableRowVariants({ className, variant })}
        ref={ref}
        {...props}
      >
        {children}
      </tr>
    );
  },
);

TableRow.displayName = "TableRow";

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ as = "td", children, className, tone, ...props }, ref) => {
    const Component = as;

    return (
      <Component
        className={tableCellVariants({ className, tone })}
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

TableCell.displayName = "TableCell";
