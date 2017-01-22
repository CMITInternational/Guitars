import Keys from './Keys';

const ACTION_HANDLERS = {
  [Keys.CLEAR_CONTACT]: (state: Object, action: Action): Object => Object.assign({}, state, initialState),
  [Keys.LOAD_CONTACT]: (state: Object, action: Action): Object => Object.assign({}, state, {
    data: action.payload,
    isReady: true
  }),
  [Keys.SET_SENDING]: (state: Object, action: Action): Object => Object.assign({}, state, {
    sending: action.payload,
    isReady: true
  })
};

export const initialState = {
  sending: 'ready',
  data: {

  },
  isReady: false
};

export default function Reducer (state: object = initialState, action: Action): object {
  const handler = ACTION_HANDLERS[action.type];

  let outState = handler ? handler(state, action) : action.type === '@@INIT' ? initialState : state;

  return outState;
}
