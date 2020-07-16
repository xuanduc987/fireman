import * as React from 'react';
import SVG from 'react-inlinesvg';
import cloud from 'heroicons/outline/cloud-upload.svg';

export function DropfileOverlay() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center items-center
      border border-blue-300 bg-blue-100 bg-opacity-75">
      <SVG src={cloud} className="inline-block h-12" />
      <span>Drop files here to upload</span>
    </div>
  );
}
