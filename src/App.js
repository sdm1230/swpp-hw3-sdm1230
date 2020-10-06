import React from 'react';
import './App.css';

import LoginPage from './containers/Login/LoginPage';
import ArticleList from './containers/Articles/List/ArticleList';
import ArticleCreate from './containers/Articles/Create/ArticleCreate';
import ArticleDetail from './containers/Articles/Detail/ArticleDetail';
import ArticleEdit from './containers/Articles/Edit/ArticleEdit';

import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path='/login' exact component={LoginPage} />
          <Route path='/articles' exact component={ArticleList} />
          <Route path='/articles/create' exact component={ArticleCreate} />
          <Route path='/articles/:id' exact component={ArticleDetail} />
          <Route path='/articles/:id/edit' exact component={ArticleEdit} />
          <Redirect exact from='/' to='login' />
          <Route render={() => <h1>Not Found</h1>} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
