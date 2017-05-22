import React, {Component} from 'react';
import { AutoComplete } from 'material-ui';

/**
 * The input is used to create the `dataSource`, so the input always matches three entries.
 */
export default class SearchBox extends Component {
  state = {
    dataSource: [],
  };

  handleUpdateInput = (value) => {
    this.setState({
      dataSource: [
        value,
        value + value,
        value + value + value +'a',
      ],
    });
  };

  render() {
    return (
      <div>
        <AutoComplete
          hintText="City, State"
          dataSource={this.state.dataSource}
          onUpdateInput={this.handleUpdateInput}
          floatingLabelText="Location"
          fullWidth={false}
        />
      </div>
    );
  }
};

