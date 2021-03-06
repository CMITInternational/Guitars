import Keys from './Keys';
import reverse from 'reverse-string';
import { routerActions } from 'react-router-redux';

const setAppReady = (): Action => {
  return {
    type: Keys.SET_APP_READY
  };
};

const clearAppReady = (): Action => {
  return {
    type: Keys.CLEAR_APP_READY
  };
};

const loadAppConfig = (data): Action => {
  return {
    type: Keys.LOAD_APP_CONFIG,
    payload: data
  };
};

const loadAppAsync = (): Function => {
  return (dispatch: Function, getState: Function): Promise => {
    return new Promise((resolve: Function, reject: Function): void => {
      console.log('App load');

      dispatch(clearAppReady());
      fetch('/appConfig.json', {
        mode: 'cors',
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      })
        .then((response) => {
          if (response.status !== 200) {
            throw new Error('appConfig fetch failed');
          }
          return response.json();
        })
        .then((json) => {
          dispatch(loadAppConfig(json.clientAppSettings));
          dispatch(setAppReady());
          resolve();
        })
        .catch((err) => {
          console.log('appConfig fetch failed');
          reject(err);
        });
    });
  };
};

const showAuth = (data): Action => {
  return {
    type: Keys.SHOW_AUTH,
    payload: data
  };
};

const showHeader = (data): Action => {
  return {
    type: Keys.SHOW_HEADER,
    payload: data
  };
};

const isAdmin = (data): Action => {
  return {
    type: Keys.SET_IS_ADMIN,
    payload: data
  };
};

const bmOffset = (offset): Action => {
  return {
    type: Keys.SET_BM_OFFSET,
    payload: offset
  };
};

const showHeaderAsync = (data): Function => {
  return (dispatch: Function, getState: Function): Promise => {
    return new Promise((resolve: Function, reject: Function): void => {
      let {willShowHeader, hasAdminHeader} = data;

      dispatch(showHeader(willShowHeader));
      dispatch(bmOffset((hasAdminHeader) ? 50 : 0));
      resolve();
    });
  };
};

const authenticateAsAdmin = (password): Function => {
  return (dispatch: Function, getState: Function): Promise => {
    return new Promise((resolve: Function, reject: Function): void => {
      let adminPassword = reverse(atob(getState().app.admin));
      if (adminPassword === password) {
        dispatch(isAdmin(true));
        resolve();
      } else {
        dispatch(isAdmin(false));
        reject();
      }
    });
  };
};

const logOut = () => {
  return (dispatch: Function, getState: Function): Promise => {
    return new Promise((resolve: Function, reject: Function): void => {
      dispatch(isAdmin(false));
      resolve();
    });
  };
};

const redirectToProducts = () => {
  return (dispatch: Function, getState: Function): Promise => {
    return new Promise((resolve: Function, reject: Function): void => {
      dispatch(routerActions.push('/products'));
      resolve();
    });
  };
};

const redirectToContactUs = () => {
  return (dispatch: Function, getState: Function): Promise => {
    return new Promise((resolve: Function, reject: Function): void => {
      dispatch(routerActions.push('/contacts'));
      resolve();
    });
  };
};

const redirectToHome = () => {
  return (dispatch: Function, getState: Function): Promise => {
    return new Promise((resolve: Function, reject: Function): void => {
      dispatch(routerActions.push('/'));
      resolve();
    });
  };
};

const redirectToProduct = (id: number) => {
  return (dispatch: Function, getState: Function): Promise => {
    return new Promise((resolve: Function, reject: Function): void => {
      dispatch(routerActions.push(`/product/${id}`));
      resolve();
    });
  };
};

const Actions = {
  loadAppAsync,
  showAuth,
  showHeader,
  logOut,
  authenticateAsAdmin,
  redirectToProducts,
  redirectToContactUs,
  redirectToHome,
  redirectToProduct,
  showHeaderAsync
};

export default Actions;
