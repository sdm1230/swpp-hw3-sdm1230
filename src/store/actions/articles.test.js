import axios from 'axios';

import * as actionCreators from './articles';
import store from '../store';

const stubArticle = {
  id: 1,
  author_id:1,
  title: 'title1',
  content: 'content1',
};

describe('ActionCreators_Articles', () => {
  afterEach(() => {
    jest.clearAllMocks();
  })
  
  it(`'getArticles' should fetch Articles correctly`, (done) => {
    const stubArticleList = [stubArticle];

    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubArticleList
          };
          resolve(result);
        });
      })

    store.dispatch(actionCreators.getArticles()).then(() => {
      const newState = store.getState();
      expect(newState.articles.articles).toBe(stubArticleList);
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'getArticle' should fetch Article correctly`, (done) => {
    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubArticle
          };
          resolve(result);
        });
      })

    store.dispatch(actionCreators.getArticle()).then(() => {
      const newState = store.getState();
      expect(newState.articles.selectedArticle).toBe(stubArticle);
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'postArticle' should post Article correctly`, (done) => {
    const spy = jest.spyOn(axios, 'post')
      .mockImplementation((url, article) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubArticle
          };
          resolve(result);
        });
      })

    store.dispatch(actionCreators.postArticle(stubArticle)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'setArticle' should set Article correctly`, (done) => {
    const spy = jest.spyOn(axios, 'put')
      .mockImplementation( (url ) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: null,
          };
          resolve(result);
        });
      })

    store.dispatch(actionCreators.setArticle(stubArticle,"newTitle","newContent")).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'deleteArticle' should delete Article correctly`, (done) => {
    const spy = jest.spyOn(axios, 'delete')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: null,
          };
          resolve(result);
        });
      })

    store.dispatch(actionCreators.deleteArticle()).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
