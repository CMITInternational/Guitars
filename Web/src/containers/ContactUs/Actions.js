import Keys from './Keys';
import omnifetch from '../../lib/fetch/omnifetch';

const clearContact = (): Action => {
  return {
    type: Keys.CLEAR_CONTACT
  };
};

const loadContact = (data): Action => {
  return {
    type: Keys.LOAD_CONTACT,
    payload: data
  };
};

const loadContactAsync = (): Function => {
  return (dispatch: Function, getState: Function): Promise => {
    return new Promise((resolve: Function, reject: Function): void => {
      dispatch(clearContact());
      let apiUrl = getState().app.apiUrl;
      let fullUrl = `${apiUrl}contact`;
      omnifetch(fullUrl)
        .then(response => {
          let data = response.body;
          if (data !== undefined && typeof data === 'object') {
            dispatch(loadContact(data));
          }
          resolve(data);
        })
        .catch(reject);
    });
  };
};

const Actions = {
  loadContactAsync
};

export default Actions;
