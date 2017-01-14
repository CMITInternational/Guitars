import Keys from './Keys';

const ACTION_HANDLERS = {
  [Keys.CLEAR_PRODUCT]: (state: Object, action: Action): Object => Object.assign({}, state, initialState),
  [Keys.LOAD_PRODUCT]: (state: Object, action: Action): Object => Object.assign({}, state, {
    data: action.payload,
    isReady: true
  }),
  [Keys.EDIT_PRODUCT_OFF]: (state: Object, action: Action): Object => Object.assign({}, state, {
    isEditing: false
  }),
  [Keys.EDIT_PRODUCT_ON]: (state: Object, action: Action): Object => Object.assign({}, state, {
    isEditing: true
  })
};

export const initialState = {
  data: {},
  isReady: false,
  isEditing: false
};

export default function Reducer (state: object = initialState, action: Action): object {
  const handler = ACTION_HANDLERS[action.type];

  let outState = handler ? handler(state, action) : action.type === '@@INIT' ? initialState : state;

  return outState;
}
