import React from 'react';
import Auth from '../modules/Auth';
import Dashboard from '../components/Dashboard.jsx';
import axios from 'axios';

class DashboardPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props) {
    super(props);

    this.state = {
      secretData: ''
    };
  }

  componentWillMount(){
    var mytoken = 'f9f6b8867c971722f6094a076ab99f3f5c1ad14e'
    var instance = axios.create({
      headers: {'Authorization': 'Token '+mytoken}
    });
    instance.get('http://localhost:8000/full_trip_search/?state=California&city=San_Francisco&n_days=1')
      .then(
        (res) => {
          console.log(res);
        }
      )
  }

  /**
   * This method will be executed after initial rendering.
   */
  componentDidMount() {
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/api/dashboard');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        this.setState({
          secretData: xhr.response.message
        });
      }
    });
    xhr.send();
  }

  /**
   * Render the component.
   */
  render() {
    return (<Dashboard secretData={this.state.secretData} />);
  }

}

export default DashboardPage;