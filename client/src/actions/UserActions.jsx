import AppDispatcher from '../dispatchers/AppDispatcher.jsx';
import UserConstants from '../constants/UserConstants.jsx';
import createBrowserHistory from '../services/History.jsx';
// import createHistory from 'history/createBrowserHistory'

export default {
    loginUser: (token) => {
        //var savedToken = localStorage.getItem('user_token');

        AppDispatcher.dispatch({
            actionType: UserConstants.LOGIN_USER,
            token: token
        });

        localStorage.setItem('user_token', token);

        // this won't work with onEnter hook in Routes

        // const history = createHistory()
 
        // // Get the current location. 
        // const location = history.location
         
        // // Listen for changes to the current location. 
        // const unlisten = history.listen((location, action) => {
        //   // location is an object like window.location 
        //   console.log(action, location.pathname, location.state)
        // })
         
        // // Use push, replace, and go to navigate around. 
        // history.push('/dashboard')
        // unlisten();
        // console.log(localStorage);
    },

    logoutUser: () => {
        createBrowserHistory.replaceState(null, '/');
        localStorage.removeItem('user_token');
        AppDispatcher.dispatch({
            actionType: UserConstants.LOGOUT_USER
        })
    },

    loadUserDetail: (data) => {
        console.log('data in action: ', data, typeof data)
        AppDispatcher.dispatch({
            actionType: UserConstants.LOAD_USER_DETAIL,
            user: data
        });
    }
}