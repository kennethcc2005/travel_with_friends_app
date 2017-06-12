import React, {PropTypes} from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import MapsMap from 'material-ui/svg-icons/maps/map';
import RaisedButton from 'material-ui/RaisedButton';

const GoogleMapUrlButton = ({googleMapUrl}) => (
  <div>
    <RaisedButton
      href={googleMapUrl}
      labelPosition="before"
      target="_blank"
      label="Open Google Map"
      primary={true}
      icon={<MapsMap className="muidocs-icon-google-map" />}
    />
  </div>
);

GoogleMapUrlButton.propTypes = {
  googleMapUrl: PropTypes.string.isRequired,
};

export default GoogleMapUrlButton;



