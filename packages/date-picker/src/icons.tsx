import React from 'react';

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export const AngleIcon: React.FC<IconProps> = ({ width = 24, height = 24, fill = '#657496' }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18L15 12L9 6" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
