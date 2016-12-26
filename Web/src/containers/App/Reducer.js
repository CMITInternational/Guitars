import Keys from './Keys';

const ACTION_HANDLERS = {
  [Keys.CLEAR_APP_READY]: (state: Object, action: Action): Object => Object.assign({}, state, {
    isReady: false
  }),
  [Keys.SET_APP_READY]: (state: Object, action: Action): Object => Object.assign({}, state, {
    isReady: true
  }),
  [Keys.LOAD_APP_CONFIG]: (state: Object, action: Action): Object => Object.assign({}, state, {
    apiUrl: action.payload.apiUrl,
    assetUrl: action.payload.assetUrl
  })
};

export const initialState = {
  isReady: false,
  apiUrl: 'api/',
  assetUrl: ''
};

export default function appReducer (state: object = initialState, action: Action): object {
  const handler = ACTION_HANDLERS[action.type];

  let outState = handler ? handler(state, action) : action.type === '@@INIT' ? initialState : state;

  return outState;
}
