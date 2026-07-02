import { ChevronDownIcon } from '@heroicons/react/24/solid';
import * as React from 'react';
import { DropdownMenuTrigger } from '../../../components/shadcn/Dropdown';
import { cn } from '../../../utils/cn';

export interface IMenuButtonProps {
  label: string | JSX.Element;
  title: string;
  disabled?: boolean;
  className?: string;
  labelClass?: string;
  buttonClass?: string;
  /**
   * When true: show "Label Value" in a bordered box with value in accent color.
   * When false: show just "Label ›" in muted gray with no box.
   * When undefined: legacy behavior ("Label: Value ›" split across two elements).
   */
  isActive?: boolean;
}

export const MenuButton: React.FunctionComponent<IMenuButtonProps> = ({
  label,
  title,
  disabled,
  className,
  labelClass,
  buttonClass,
  isActive,
}: React.PropsWithChildren<IMenuButtonProps>) => {
  if (isActive === true) {
    return (
      <DropdownMenuTrigger
        className={cn(
          'flex items-center shrink-0 rounded-md px-2 py-1 gap-1 text-sm focus:outline-none',
          disabled && 'opacity-50',
          className
        )}
        style={{
          border: '1px solid var(--frontmatter-border)',
          backgroundColor: 'var(--vscode-dropdown-background)'
        }}
        disabled={disabled}
      >
        <span className={cn('font-medium', labelClass)} style={{ color: 'var(--fm-text-lo)' }}>
          {label}
        </span>
        <span className="font-medium" style={{ color: 'var(--fm-accent)' }}>{title}</span>
        <ChevronDownIcon className="h-4 w-4 shrink-0" aria-hidden="true" style={{ color: 'var(--fm-text-lo)' }} />
      </DropdownMenuTrigger>
    );
  }

  if (isActive === false) {
    return (
      <DropdownMenuTrigger
        className={cn(
          'flex items-center shrink-0 gap-1 text-sm font-medium focus:outline-none hover:text-[var(--vscode-tab-activeForeground)]',
          disabled && 'opacity-50',
          className
        )}
        style={{ color: 'var(--vscode-tab-inactiveForeground)' }}
        disabled={disabled}
      >
        <span className={cn(labelClass)}>{label}</span>
        <ChevronDownIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
      </DropdownMenuTrigger>
    );
  }

  return (
    <div className={cn(`group flex items-center shrink-0 ${disabled ? 'opacity-50' : ''} ${className || ""}`)}>
      <div className={cn(`mr-2 font-medium flex items-center text-[var(--vscode-tab-inactiveForeground)] ${labelClass || ""}`)}>
        {label}:
      </div>

      <DropdownMenuTrigger
        className={cn(`text-[var(--vscode-textLink-foreground)] hover:text-[var(--vscode-textLink-activeForeground)] flex items-center focus:outline-none ${buttonClass || ""}`)}
        disabled={disabled}>
        <span>{title}</span>
        <ChevronDownIcon className={`-mr-1 ml-1 h-4 w-4`} aria-hidden="true" />
      </DropdownMenuTrigger>
    </div>
  );
};
