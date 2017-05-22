import RaisedButton from 'material-ui/RaisedButton';
import React, {PropTypes} from 'react';

// encodeURIComponent(myUrl)
const FullTripSearchButton = ({onFullTripSubmit}) => {
  return (
    <div>
      <RaisedButton label="Search" primary={true} onClick={onFullTripSubmit}/>
    </div>
    )
}

FullTripSearchButton.propTypes = {
  onFullTripSubmit: PropTypes.func.isRequired,
};

export default FullTripSearchButton;