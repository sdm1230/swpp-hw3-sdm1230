import axios from 'axios';

import * as actionCreators from './comments';
import store from '../store';

const stubComment = {
  id: 1,
  author_id:1,
  article_id: 1,
  content: 'content1',
};

describe('ActionCreators_Comments', () => {
  afterEach(() => {
    jest.clearAllMocks();
  })
  
  it(`'getComments' should fetch Comments correctly`, (done) => {
    const stubCommentList = [stubComment];

    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubCommentList
          };
          resolve(result);
        });
      })

    store.dispatch(actionCreators.getComments()).then(() => {
      const newState = store.getState();
      expect(newState.comments.comments).toBe(stubCommentList);
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'postComment' should post Comment correctly`, (done) => {
    const spy = jest.spyOn(axios, 'post')
      .mockImplementation((url, comment) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubComment
          };
          resolve(result);
        });
      })

    store.dispatch(actionCreators.postComment(stubComment)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'setComment' should set Comment correctly`, (done) => {
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

    store.dispatch(actionCreators.setComment(stubComment,"newContent")).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'deleteComment' should delete Comment correctly`, (done) => {
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

    store.dispatch(actionCreators.deleteComment()).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
