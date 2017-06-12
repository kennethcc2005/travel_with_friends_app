import React, {PropTypes} from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentRedo from 'material-ui/svg-icons/content/redo';

const FullTripResetButton = ({onFullTripReset}) => (
  <div>
    <FloatingActionButton mini={true} onClick={onFullTripReset}>
      <ContentRedo />
    </FloatingActionButton>
  </div>
);

FullTripResetButton.propTypes = {
  onFullTripReset: PropTypes.func.isRequired,
};

export default FullTripResetButton;

