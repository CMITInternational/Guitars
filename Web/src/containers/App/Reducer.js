import Keys from './Keys';

const ACTION_HANDLERS = {
  [Keys.CLEAR_APP_READY]: (state: Object, action: Action): Object => Object.assign({}, state, {
    isReady: false
  }),
  [Keys.SET_APP_READY]: (state: Object, action: Action): Object => Object.assign({}, state, {
    isReady: true
  }),
  [Keys.SHOW_AUTH]: (state: Object, action: Action): Object => Object.assign({}, state, {
    showAuth: action.payload
  }),
  [Keys.SET_IS_ADMIN]: (state: Object, action: Action): Object => Object.assign({}, state, {
    isAdmin: action.payload
  }),
  [Keys.LOAD_APP_CONFIG]: (state: Object, action: Action): Object => Object.assign({}, state, {
    apiUrl: action.payload.apiUrl,
    assetUrl: action.payload.assetUrl,
    admin: action.payload.admin
  })
};

export const initialState = {
  isReady: false,
  apiUrl: 'api/',
  assetUrl: '',
  admin: '',
  showAuth: false,
  showAuthError: false,
  isAdmin: false
};

export default function appReducer (state: object = initialState, action: Action): object {
  const handler = ACTION_HANDLERS[action.type];

  let outState = handler ? handler(state, action) : action.type === '@@INIT' ? initialState : state;

  return outState;
}
