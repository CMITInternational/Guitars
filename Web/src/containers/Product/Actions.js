import Keys from './Keys';
import omnifetch from '../../lib/fetch/omnifetch';
import omniPost from '../../lib/fetch/omnipost';
import omniPostData from '../../lib/fetch/omnipostdata';
import type IGuitar from '../../models/IGuitar';
import _ from 'lodash';

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
          .then((response) => {
            let data = response.body;
            if (data !== undefined && typeof data === 'object') {
              dispatch(loadProductAsync(data.Id))
                .then(() => resolve(data.Id))
                .catch(reject);
            } else {
              resolve();
            }
          })
          .catch(reject);
      } else {
        reject('guitar must be populated for save');
      }
    });
  };
};

const saveProductImagesAsync = (images, isThumbnail): Function => {
  return (dispatch: Function, getState: Function): Promise => {
    return new Promise((resolve: Function, reject: Function): void => {
      let apiUrl = getState().app.apiUrl;
      let productId = getState().product.data.Id;
      if (images !== undefined) {
        let fullUrl = `${apiUrl}portfolio/uploadfile`;
        let form = new FormData();
        let idx = 0;
        _.forEach(images, image => {
          form.append(`UploadedImage${idx++}`, image);
        });
        form.append('Project', productId);
        form.append('IsThumbNail', isThumbnail);
        omniPostData(fullUrl, form)
          .then((response) => {
            let data = response.body;
            if (data !== undefined && typeof data === 'object') {
              dispatch(loadProductAsync(data.Id))
                .then(() => resolve(data.Id))
                .catch(reject);
            } else {
              resolve();
            }
          })
          .catch(reject);
      } else {
        reject('images must be populated for save');
      }
    });
  };
};

const Actions = {
  loadProductAsync,
  saveProductAsync,
  saveProductImagesAsync,
  editProductOn,
  editProductOff
};

export default Actions;
