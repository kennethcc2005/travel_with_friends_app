import React from 'react';
import Auth from '../services/AuthService.jsx'
import {Link} from 'react-router';
import UserActions from '../actions/UserActions.jsx';
import UserStore from '../stores/UserStore.jsx';

class UserDetailPage extends React.Component {

  constructor() {
      super();
      this.state = {
          user: {
              email: '',
              username: '',
              firstname: '',
              lastname: '',
              fulltrips: '',
          }
      };

      // need .bind(this), otherwise this will be UserStore
      UserStore.addChangeListener(this._onChange.bind(this));
      console.log(UserStore)
      this.loadUserDetail();
      // this.loadUserDetail = this.loadUserDetail.bind(this);

      this.tableStyles = {
          fontSize: "14px"
      }
  }

  loadUserDetail() {
      console.log('detail', this.state.user, UserStore.token, localStorage)

      Auth.getUserData(UserStore.token);
  }

  logout() {
      Auth.logout()
  }

  _onChange() {
    console.log('user on change: ', UserStore)
    if (UserStore.user !== undefined) {
        this.state.user = UserStore.user;
    }
  }

  // componentWillMount() {

  //   Auth.getUserData(localStorage.token);

  // }

  // componentWillReceiveProps(nextProps) {
    
  // }

  // componentDidMount() {
  // }

  // componentDidUpdate(prevProps, prevState) {
    
  // }

  // shouldComponentUpdate(nextProps,nextState) {
     
  // }
  render() {
      console.log('detail render', this.state.user, UserStore.token, localStorage)
      return (
          <div className="container jumbotron">
              <h2>User Detail</h2>
              <table className="table" style={this.tableStyles}>
                  <tbody>
                      <tr>
                          <td>Email: </td>
                          <td>{this.state.user.email}</td>
                      </tr>
                      <tr>
                          <td>Username: </td>
                          <td>{this.state.user.username}</td>
                      </tr>
                      <tr>
                          <td>Firstname: </td>
                          <td>{this.state.user.firstname}</td>
                      </tr>
                      <tr>
                          <td>Lastname: </td>
                          <td>{this.state.user.lastname}</td>
                      </tr>
                  </tbody>
              </table>
          </div>
      )
  }
}


export default UserDetailPage;