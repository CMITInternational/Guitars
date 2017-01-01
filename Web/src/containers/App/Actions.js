import Keys from './Keys';
import reverse from 'reverse-string';

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
        .catch(reject);
    });
  };
};

const showAuth = (data): Action => {
  return {
    type: Keys.SHOW_AUTH,
    payload: data
  };
};

const isAdmin = (data): Action => {
  return {
    type: Keys.SET_IS_ADMIN,
    payload: data
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

const Actions = {
  loadAppAsync,
  showAuth,
  logOut,
  authenticateAsAdmin
};

export default Actions;
