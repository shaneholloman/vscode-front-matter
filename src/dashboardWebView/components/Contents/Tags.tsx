import * as React from 'react';
import { Tag } from './Tag';

export interface ITagsProps {
  values?: string[];
  tagField?: string | null | undefined;
  onExpandChange?: (expanded: boolean) => void;
}

const MAX_VISIBLE = 3;

export const Tags: React.FunctionComponent<ITagsProps> = ({
  values,
  tagField,
  onExpandChange
}: React.PropsWithChildren<ITagsProps>) => {
  const [expanded, setExpanded] = React.useState(false);

  if (!values || values.length === 0) {
    return null;
  }

  const filtered = values.filter(Boolean);
  const visible = expanded ? filtered : filtered.slice(0, MAX_VISIBLE);
  const overflow = filtered.length - MAX_VISIBLE;

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !expanded;
    setExpanded(next);
    onExpandChange?.(next);
  };

  return (
    <div className={`flex items-center gap-1 flex-wrap`}>
      {visible.map((tag, index) => (
        <Tag key={index} value={tag} tagField={tagField} />
      ))}
      {!expanded && overflow > 0 && (
        <button
          className="flex-shrink-0 inline-flex items-center text-[0.65rem] font-medium px-1.5 py-0.5 rounded-full"
          style={{
            color: 'var(--vscode-button-foreground)',
            backgroundColor: 'var(--frontmatter-button-background)'
          }}
          onClick={toggle}
        >
          +{overflow}
        </button>
      )}
    </div>
  );
};
