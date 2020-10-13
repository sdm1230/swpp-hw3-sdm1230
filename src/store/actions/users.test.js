import axios from 'axios';

import * as actionCreators from './users';
import store from '../store';

const stubUser = {
  id: 1,
  email:"email1",
  password: "password1",
  logged_in: true,
};

describe('ActionCreators_Users', () => {
  afterEach(() => {
    jest.clearAllMocks();
  })
  
  it(`'getUsers' should fetch Users correctly`, (done) => {
    const stubUserList = [stubUser];

    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubUserList
          };
          resolve(result);
        });
      })

    store.dispatch(actionCreators.getUsers()).then(() => {
      const newState = store.getState();
      expect(newState.users.users).toBe(stubUserList);
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'setUser' should set User correctly`, (done) => {
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

    store.dispatch(actionCreators.setUser(stubUser)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
