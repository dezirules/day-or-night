import React from 'react';
import Icon from './Icon';

const Marker = props => (
  <div className="marker">
    {props.dayOrNight === 'day' && (
      <div className="marker__container">
        <Icon icon="icon-sunny" className="icon--sunny" />
        <div>It's currently day</div>
      </div>
    )}
    {props.dayOrNight === 'night' && (
      <div className="marker__container">
        <Icon icon="icon-night" className="icon--night" />
        <div>It's currently night</div>
      </div>
    )}
    {props.dayOrNight === 'n/a' && (
      <div className="marker__container">
        <Icon icon="icon-mine" className="icon--na" />
        <div>Data not available</div>
      </div>
    )}
  </div>
);

export default Marker;
