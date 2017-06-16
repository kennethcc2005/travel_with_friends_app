import RaisedButton from 'material-ui/RaisedButton';
import React, {PropTypes} from 'react';

// encodeURIComponent(myUrl)
const FullTripUserSubmitButton = ({onFullTripUserSubmit}) => {
  return (
    <div>
      <RaisedButton label="Save the Full Trip" primary={true} onClick={onFullTripUserSubmit}/>
    </div>
    )
}

FullTripUserSubmitButton.propTypes = {
  onFullTripUserSubmit: PropTypes.func.isRequired,
};

export default FullTripUserSubmitButton