import Base from './components/Base.jsx';
import HomePage from './containers/HomePage.jsx';
import DashboardPage from './containers/DashboardPage.jsx';
import UserDetailPage from './containers/UserDetailPage.jsx';
import OutsideTripPage from './containers/OutsideTripPage.jsx';
import CreateTripPage from './containers/CreateTripPage.jsx';
import LoginPage from './containers/LoginPage.jsx';
import SignUpPage from './containers/SignUpPage.jsx';
import Auth from './modules/Auth';


const routes = {
  // base component (wrapper for the whole application).
  component: Base,
  childRoutes: [

    {
      path: '/',
      component: HomePage
      // getComponent: (location, callback) => {
      //   if (Auth.isUserAuthenticated()) {
      //     callback(null, DashboardPage);
      //   } else {
      //     callback(null, HomePage);
      //   }
      // }
    },

    {
      path: '/dashboard',
      component: DashboardPage
    },

    {
      path: '/explore',
      component: OutsideTripPage
    },

    {
      path: '/create',
      component: CreateTripPage
    },

    {
      path: '/user',
      component: UserDetailPage
    },

    {
      path: '/login',
      component: LoginPage
    },

    {
      path: '/signup',
      component: SignUpPage
    },

    {
      path: '/logout',
      onEnter: (nextState, replace) => {
        Auth.deauthenticateUser();

        // change the current URL to /
        replace('/');
      }
    }

  ]
};

export default routes;