import Keys from './Keys';

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

const Actions = {
  loadAppAsync
};

export default Actions;
