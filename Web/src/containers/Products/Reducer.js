import Keys from './Keys';

const ACTION_HANDLERS = {
  [Keys.CLEAR_PRODUCTS]: (state: Object, action: Action): Object => Object.assign({}, state, initialState),
  [Keys.LOAD_PRODUCTS]: (state: Object, action: Action): Object => Object.assign({}, state, {
    data: action.payload,
    isReady: true
  })
};

export const initialState = {
  data: [],
  isReady: false
};

export default function Reducer (state: object = initialState, action: Action): object {
  const handler = ACTION_HANDLERS[action.type];

  let outState = handler ? handler(state, action) : action.type === '@@INIT' ? initialState : state;

  return outState;
}
