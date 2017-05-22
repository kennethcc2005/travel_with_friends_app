import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

// encodeURIComponent(myUrl)
const MenuItemDays = ({daysValue, handleDaysOnChange}) => {
  let boundType = handleDaysOnChange.bind(this);
  return (
        <div>
        <SelectField
          floatingLabelText="Days"
          value={daysValue}
          onChange={boundType}
        >
          <MenuItem value={'1'} primaryText="1" />
          <MenuItem value={'2'} primaryText="2" />
          <MenuItem value={'3'} primaryText="3" />
          <MenuItem value={'4'} primaryText="4" />
          <MenuItem value={'5'} primaryText="5" />
        </SelectField>
      </div>
      )
}

MenuItemDays.propTypes = {
  daysValue: PropTypes.string.isRequired,
  handleDaysOnChange: PropTypes.func.isRequired,
};

export default MenuItemDays;