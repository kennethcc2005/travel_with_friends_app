import React, {PropTypes} from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ActionDone from 'react-material-icons/icons/action/done';


const FullTripConfirmButton = ({onFullTripConfirm}) => (
  <div>
    <FloatingActionButton mini={true} onClick={onFullTripConfirm}>
      <ActionDone />
    </FloatingActionButton>
  </div>
);

FullTripConfirmButton.propTypes = {
  onFullTripConfirm: PropTypes.func.isRequired,
};

export default FullTripConfirmButton;

