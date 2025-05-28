import React from 'react';
import './ShimmerCircle.scss';

interface ShimmerCircleProps {
  size?: 200; 
}

const ShimmerCircle: React.FC<ShimmerCircleProps> = ({ size = 200 }) => {
  return (
    <div
      className="shimmer-circle"
      style={{ width: size, height: size, borderRadius: size / 2 }}
      aria-label="Loading placeholder"
    />
  );
};

export default ShimmerCircle;
