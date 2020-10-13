import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';                                         

const getMockReducer = jest.fn(
  initialState => (state = initialState, action) => {
    switch (action.type) {
      default:
        break;
    }
    return state;
  }
);

export const getMockStore = (initialState) => {
  const mockArticlesReducer = getMockReducer(initialState[0]);
  const mockUsersReducer = getMockReducer(initialState[1]);
  const mockCommentsReducer = getMockReducer(initialState[2]);

  const rootReducer = combineReducers({
    articles: mockArticlesReducer,
    users: mockUsersReducer,
    comments: mockCommentsReducer,
  });

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const mockStore = createStore(rootReducer,composeEnhancers(applyMiddleware(thunk)));

  return mockStore;
}


