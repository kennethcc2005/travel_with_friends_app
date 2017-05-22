import React, { PropTypes } from 'react'
import { AutoComplete }     from 'material-ui';
import {debounce} from 'throttle-debounce';

// encodeURIComponent(myUrl)
const SearchCityState = ({searchText, floatingLabelText, dataSource, onUpdateInput}) => {
  return (
        <AutoComplete
          searchText          ={searchText}
          floatingLabelText   ={floatingLabelText}
          filter              ={AutoComplete.noFilter}
          openOnFocus         ={true}
          dataSource          ={dataSource}
          onUpdateInput       ={debounce(300,onUpdateInput)} 
          className           ="searchInputField"
        />
      )
}

SearchCityState.propTypes = {
  searchText: PropTypes.string.isRequired,
  floatingLabelText: PropTypes.string.isRequired,
  dataSource: PropTypes.array.isRequired,
  onUpdateInput: PropTypes.func.isRequired,
};

export default SearchCityState;
