import Keys from './Keys';
import omnifetch from '../../lib/fetch/omnifetch';
import omniPost from '../../lib/fetch/omnipost';
import type IGuitar from '../../models/IGuitar';

const clearProduct = (): Action => {
  return {
    type: Keys.CLEAR_PRODUCT
  };
};

const loadProduct = (data): Action => {
  return {
    type: Keys.LOAD_PRODUCT,
    payload: data
  };
};

const editProductOn = (): Action => {
  return {
    type: Keys.EDIT_PRODUCT_ON
  };
};

const editProductOff = (): Action => {
  return {
    type: Keys.EDIT_PRODUCT_OFF
  };
};

const loadProductAsync = (id: number): Function => {
  return (dispatch: Function, getState: Function): Promise => {
    return new Promise((resolve: Function, reject: Function): void => {
      dispatch(clearProduct());
      let apiUrl = getState().app.apiUrl;
      if (id !== undefined) {
        let fullUrl = `${apiUrl}portfolio/${id}`;
        omnifetch(fullUrl)
          .then(response => {
            let data = response.body;
            if (data !== undefined && typeof data === 'object') {
              dispatch(loadProduct(data));
            }
            resolve(data);
          })
          .catch(reject);
      } else {
        reject('Invalid Product Id');
      }
    });
  };
};

const saveProductAsync = (guitar: IGuitar): Function => {
  return (dispatch: Function, getState: Function): Promise => {
    return new Promise((resolve: Function, reject: Function): void => {
      dispatch(clearProduct());
      let apiUrl = getState().app.apiUrl;
      if (guitar !== undefined) {
        let fullUrl = `${apiUrl}portfolio/`;
        let params = JSON.stringify(guitar);
        omniPost(fullUrl, params, 'json')
          .then(() => {
            dispatch(loadProductAsync(guitar.Id))
              .then(resolve)
              .catch(reject);
          })
          .catch(reject);
      } else {
        reject('guitar must be populated for save');
      }
    });
  };
};

const Actions = {
  loadProductAsync,
  saveProductAsync,
  editProductOn,
  editProductOff
};

export default Actions;
