import React from 'react';

function createAssetIcon(fileName) {
  return function AssetIcon({ className }) {
    return (
      <img
        className={className}
        src={`${process.env.PUBLIC_URL}/assets/Home/${fileName}`}
        alt=""
        aria-hidden="true"
      />
    );
  };
}

export const STAGE_ICONS = {
  sketch: createAssetIcon('pencil.svg'),
  screen: createAssetIcon('wireframe.svg'),
  motion: createAssetIcon('interactivity.svg')
};
