import Keys from './Keys';
import omnifetch from '../../lib/fetch/omnifetch';
import omniPost from '../../lib/fetch/omnipost';
import type IMessage from './IMessage';

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

const setSending = (sending): Action => {
  return {
    type: Keys.SET_SENDING,
    payload: sending
  };
};

const editOn = (): Action => {
  return {
    type: Keys.EDIT_CONTACT_US_ON
  };
};

const editOff = (): Action => {
  return {
    type: Keys.EDIT_CONTACT_US_OFF
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

const saveContactAsync = (data): Function => {
  return (dispatch: Function, getState: Function): Promise => {
    return new Promise((resolve: Function, reject: Function): void => {
      dispatch(clearContact());
      let apiUrl = getState().app.apiUrl;
      let fullUrl = `${apiUrl}contact`;
      let params = JSON.stringify(data);
      omniPost(fullUrl, params, 'json')
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

const sendMessageAsync = (message: IMessage): Function => {
  return (dispatch: Function, getState: Function): Promise => {
    return new Promise((resolve: Function, reject: Function): void => {
      dispatch(setSending('sending'));
      let apiUrl = getState().app.apiUrl;
      if (message !== undefined) {
        let fullUrl = `${apiUrl}contact/email`;
        let params = JSON.stringify(message);
        omniPost(fullUrl, params, 'json')
          .then((response) => {
            let data = response.body;
            if (data !== undefined && data === true) {
              dispatch(setSending('done'));
              resolve();
            } else {
              dispatch(setSending('failed'));
              resolve();
            }
          })
          .catch((response) => {
            dispatch(setSending('failed'));
            reject();
          });
      } else {
        reject('message must be populated for send');
      }
    });
  };
};

const Actions = {
  loadContactAsync,
  saveContactAsync,
  sendMessageAsync,
  setSending,
  editOff,
  editOn
};

export default Actions;
