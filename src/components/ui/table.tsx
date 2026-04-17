import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}
export interface TableHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {}
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}
export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
  ),
);
Table.displayName = 'Table';

export const TableHeader = React.forwardRef<HTMLDivElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('my-4', className)} {...props} />
  ),
);
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('divide-y divide-border', className)} {...props} />
  ),
);
TableBody.displayName = 'TableBody';

export const TableHead = React.forwardRef<HTMLTableHeaderCellElement, TableHeadProps>(
  ({ className, scope = 'col', ...props }, ref) => (
    <th ref={ref} scope={scope} className={cn('pb-2 text-left text-sm font-semibold text-muted-foreground', className)} {...props} />
  ),
);
TableHead.displayName = 'TableHead';

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr ref={ref} className={cn('even:bg-muted', className)} {...props} />
  ),
);
TableRow.displayName = 'TableRow';

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn('p-2 align-top text-sm', className)} {...props} />
  ),
);
TableCell.displayName = 'TableCell';
