import React, {PropTypes} from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
const FullTripAddEventButton = ({onAddEventSubmit}) => (
  <div>
    <FloatingActionButton mini={true} onClick={onAddEventSubmit}>
      <ContentAdd />
    </FloatingActionButton>
  </div>
);

FullTripAddEventButton.propTypes = {
  onAddEventSubmit: PropTypes.func.isRequired,
};

export default FullTripAddEventButton;

