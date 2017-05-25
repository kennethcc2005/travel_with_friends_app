import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const FullTripAddEventButton = () => (
  <div>
    <FloatingActionButton mini={true}>
      <ContentAdd />
    </FloatingActionButton>
  </div>
);

export default FullTripAddEventButton;

