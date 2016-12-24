import Keys from './Keys';

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
      let products = [
        {
          id: '0FF09A43-A978-48A2-BC01-08DA1E90AAC0',
          label: 'One',
          smallDesc: 'Small',
          thumbUrl: '/assets/projects/0FF09A43-A978-48A2-BC01-08DA1E90AAC0/thumb.png'
        },
        {
          id: '1DEB168A-BFA7-4F1C-A4C1-CB5D152F9216',
          label: 'Two',
          smallDesc: 'Small',
          thumbUrl: '/assets/projects/1DEB168A-BFA7-4F1C-A4C1-CB5D152F9216/thumb.png'
        },
        {
          id: '02CA4768-5CEE-487A-8CA3-F711D5FF494A',
          label: 'Three',
          smallDesc: 'Small',
          thumbUrl: '/assets/projects/02CA4768-5CEE-487A-8CA3-F711D5FF494A/thumb.jpg'
        },
        {
          id: '9433FDF4-410F-45AD-8ADC-2DF57271005D',
          label: 'Four',
          smallDesc: 'Small',
          thumbUrl: '/assets/projects/9433FDF4-410F-45AD-8ADC-2DF57271005D/thumb.png'
        },
        {
          id: 'BBC926AA-B421-40E3-8DF9-C344C0CF64F1',
          label: 'Five',
          smallDesc: 'Small',
          thumbUrl: '/assets/projects/BBC926AA-B421-40E3-8DF9-C344C0CF64F1/thumb.png'
        },
        {
          id: 'C8AC019E-2C0A-4978-8CC4-F9690807BF93',
          label: 'Six',
          smallDesc: 'Small',
          thumbUrl: '/assets/projects/C8AC019E-2C0A-4978-8CC4-F9690807BF93/thumb.png'
        }
      ];

      dispatch(clearProducts());
      dispatch(loadProducts(products));
      resolve(products);
    });
  };
};

const Actions = {
  loadProductsAsync
};

export default Actions;
