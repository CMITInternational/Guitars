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

const loadAppAsync = (): Function => {
  return (dispatch: Function, getState: Function): Promise => {
    return new Promise((resolve: Function, reject: Function): void => {
      dispatch(clearAppReady());
      dispatch(setAppReady());
      resolve();
    });
  };
};

const Actions = {
  loadAppAsync
};

export default Actions;
