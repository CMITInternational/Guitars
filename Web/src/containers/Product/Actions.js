import Keys from './Keys';
import omnifetch from '../../lib/fetch/omnifetch';

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

const Actions = {
  loadProductAsync
};

export default Actions;
