import React, {PropTypes} from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRedo from 'material-ui/svg-icons/content/redo';
import ContentSave from 'material-ui/svg-icons/content/save';

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

