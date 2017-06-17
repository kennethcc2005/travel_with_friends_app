import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

// encodeURIComponent(myUrl)
const MenuItemDirections = ({directionValue, handleDirectionsOnChange}) => {
  let boundType = handleDirectionsOnChange.bind(this);
  return (
        <div>
        <SelectField
          floatingLabelText="Direction"
          value={directionValue}
          onChange={boundType}
        >
          <MenuItem value={'N'} primaryText="North" />
          <MenuItem value={'S'} primaryText="South" />
          <MenuItem value={'E'} primaryText="East" />
          <MenuItem value={'W'} primaryText="West" />
        </SelectField>
      </div>
      )
}

MenuItemDirections.propTypes = {
  directionValue: PropTypes.string.isRequired,
  handleDirectionsOnChange: PropTypes.func.isRequired,
};

export default MenuItemDirections;