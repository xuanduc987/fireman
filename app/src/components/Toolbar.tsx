import * as React from 'react';
import SVG from 'react-inlinesvg';
import addFolder from 'heroicons/outline/folder-add.svg';
import addFiles from 'heroicons/outline/document-add.svg';
import del from 'heroicons/outline/trash.svg';
import rename from 'heroicons/outline/pencil.svg';

import { noop } from '../utils';

type ButtonType = 'del' | 'addFolder' | 'addFiles' | 'rename';

export type ToolbarProps = {
  buttons: ButtonType[];
  onButtonClick?: (btn: ButtonType) => void;
  breadCrumbItems: Array<{ key: string; name: string }>;
  onBreadCrumbItemClick?: (key: string) => void;
  className?: string;
};

export function Toolbar(props: ToolbarProps) {
  let {
    buttons,
    onButtonClick = noop,
    breadCrumbItems,
    onBreadCrumbItemClick = noop,
    className = '',
  } = props;
  return (
    <div
      className={
        'w-full py-2 border-b flex justify-between items-center ' + className
      }
    >
      <BreadCrumbs
        items={breadCrumbItems}
        onItemClick={onBreadCrumbItemClick}
      />
      <div className="space-x-1">
        {buttons.map((b, i) => (
          <ToolbarButton
            key={i}
            buttonType={b}
            onClick={() => {
              onButtonClick(b);
            }}
          />
        ))}
      </div>
    </div>
  );
}

const icons = {
  del,
  addFolder,
  addFiles,
  rename,
};

type ToolbarButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  buttonType: ButtonType;
};

function ToolbarButton(props: ToolbarButtonProps) {
  let { buttonType, className = '', ...rest } = props;
  return (
    <button
      className={'hover:bg-gray-200 py-1 px-2 rounded ' + className}
      {...rest}
    >
      <SVG src={icons[buttonType]} className="block h-5" />
    </button>
  );
}

type BreadcrumbsProps = {
  items: Array<{ key: string; name: string }>;
  onItemClick: (key: string) => void;
};

function BreadCrumbs(props: BreadcrumbsProps) {
  let { items, onItemClick = noop } = props;
  return (
    <nav>
      <ol className="flex">
        {items.map(({ key, name }, i) => (
          <React.Fragment key={key}>
            {i != 0 && (
              <li>
                <span className="mx-2 text-gray-700">&gt;</span>
              </li>
            )}
            <li>
              {i === items.length - 1 ? (
                <span className="py-1 px-2 rounded text-gray-700">{name}</span>
              ) : (
                <a
                  className="hover:bg-gray-200 py-1 px-2 rounded text-blue-700"
                  href={`/${key}`}
                  onClick={(e) => {
                    onItemClick(key);
                    e.preventDefault();
                  }}
                >
                  {name}
                </a>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}
