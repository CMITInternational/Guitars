import Keys from './Keys';
import omnifetch from '../../lib/fetch/omnifetch';
import omniPost from '../../lib/fetch/omnipost';

const clearProducts = (): Action => {
  return {
    type: Keys.CLEAR_PRODUCTS
  };
};

const loadProducts = (data): Action => {
  return {
    type: Keys.LOAD_PRODUCTS,
    payload: data
  };
};

const loadProductsAsync = (): Function => {
  return (dispatch: Function, getState: Function): Promise => {
    return new Promise((resolve: Function, reject: Function): void => {
      dispatch(clearProducts());
      let apiUrl = getState().app.apiUrl;
      let fullUrl = `${apiUrl}portfolio`;
      omnifetch(fullUrl)
        .then(response => {
          let data = response.body;
          if (data !== undefined && typeof data === 'object') {
            dispatch(loadProducts(data));
          }
          resolve(data);
        })
        .catch(reject);
    });
  };
};

const removeProductAsync = (id: number): Function => {
  return (dispatch: Function, getState: Function): Promise => {
    return new Promise((resolve: Function, reject: Function): void => {
      dispatch(clearProducts());
      let apiUrl = getState().app.apiUrl;
      if (id !== undefined) {
        let fullUrl = `${apiUrl}portfolio/${id}/remove`;
        omniPost(fullUrl, JSON.stringify({}), 'json')
          .then(response => {
            let data = response.body;
            if (data !== undefined && typeof data === 'object') {
              dispatch(loadProducts(data));
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

const Actions = {
  loadProductsAsync,
  removeProductAsync
};

export default Actions;
