import React, { PropTypes } from 'react';
import SignUpForm from '../components/SignUpForm.jsx';
import Auth from '../services/AuthService.jsx';


class SignUpPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      user: {
        email: '',
        name: '',
        password1: '',
        password2: '',
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();
    const _this = this;
    // create a string for an HTTP body message
    const username = encodeURIComponent(this.state.user.name);
    const email = encodeURIComponent(this.state.user.email);
    const password1 = encodeURIComponent(this.state.user.password1);
    const password2 = encodeURIComponent(this.state.user.password2);
    const formData = `name=${name}&email=${email}&password=${password2}`;
    console.log(name, email, password1, password2)
    console.log('test emails',this.state.user.email)
    // create an AJAX request


    Auth.signup(this.state.user.email, username, password1, password2)
            .catch(function(err) {
              if (err.status === 200) {
                this.setState({
                  errors: {}
                });
                console.log('bug??')
              } else {
                console.log("Error logging in", err);
                _this.setState({
                  errors: JSON.parse(err.response)
                });
              }
            });

    // const xhr = new XMLHttpRequest();
    // xhr.open('post', '/auth/signup');
    // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // xhr.responseType = 'json';
    // xhr.addEventListener('load', () => {
    //   if (xhr.status === 200) {
    //     // success

    //     // change the component-container state
    //     this.setState({
    //       errors: {}
    //     });

    //     // set a message
    //     localStorage.setItem('successMessage', xhr.response.message);

    //     // make a redirect
    //     this.context.router.replace('/login');
    //   } else {
    //     // failure

    //     const errors = xhr.response.errors ? xhr.response.errors : {};
    //     errors.summary = xhr.response.message;

    //     this.setState({
    //       errors
    //     });
    //   }
    // });
    // xhr.send(formData);
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }

  /**
   * Render the component.
   */
  render() {
    return (
      <SignUpForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        user={this.state.user}
      />
    );
  }

}

SignUpPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default SignUpPage;