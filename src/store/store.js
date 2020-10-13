import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';                                           
//import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import articlesReducer from './reducers/articles';
import usersReducer from './reducers/users';
import commentsReducer from './reducers/comments'

export const history = createBrowserHistory();

const rootReducer = combineReducers({
    articles: articlesReducer,
    users: usersReducer,
    comments: commentsReducer,
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer,composeEnhancers(applyMiddleware(thunk)));

export default store;
