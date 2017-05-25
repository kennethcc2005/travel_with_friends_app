import React, { PropTypes } from 'react'
import { AutoComplete }     from 'material-ui';
import {debounce} from 'throttle-debounce';

// encodeURIComponent(myUrl)
const SearchInputField = ({name,searchText, floatingLabelText, dataSource, onUpdateInput, hintText, inputStyle}) => {
  return (
        <AutoComplete
          name                ={name}
          searchText          ={searchText}
          floatingLabelText   ={floatingLabelText}
          filter              ={AutoComplete.noFilter}
          openOnFocus         ={true}
          dataSource          ={dataSource}
          onUpdateInput       ={debounce(600,onUpdateInput)} 
          className           ="searchInputField"
          inputStyle          ={inputStyle}
          placeholder         ={hintText}
        />
      )
}

SearchInputField.propTypes = {
  name: PropTypes.string.isRequired,
  searchText: PropTypes.string.isRequired,
  floatingLabelText: PropTypes.string,
  dataSource: PropTypes.array.isRequired,
  onUpdateInput: PropTypes.func.isRequired,
  hintText: PropTypes.string,
  inputStyle: PropTypes.object,
};

export default SearchInputField;
