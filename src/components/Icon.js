import React from 'react';
import icons from '../icons/icons.svg';

const Icon = props => (
  <svg className={`icon ${props.className}`} viewBox="0 0 16 16">
    <use xlinkHref={`${icons}#${props.icon}`} />
  </svg>
);

export default Icon;
