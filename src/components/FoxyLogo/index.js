import React from 'react';

const FoxyLogo = ({ width = 200, height = 200, className = '' }) => {
  return (
    <img
      src={process.env.PUBLIC_URL + '/foxy-logo.png'}
      alt="Foxy Confidential Logo"
      width={width}
      height={height}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default FoxyLogo;