import React from 'react';

import reducer from './Users';
import * as actionTypes from '../actions/actionTypes';

const stubUser = { id: 1, email: 'email1', password: 'password1', logged_in:false };

describe('usersReducer', () => {
    it('should return default state', () => {
        const newState = reducer(undefined, {}); // initialize
        expect(newState).toEqual({ users: [] });
    });

    it('should set User', () => {
        const stubInitialState = {
            users: [stubUser]
        };
        let newState = reducer(stubInitialState, {
            type: actionTypes.SET_LOGIN,
            targetUser: stubUser,
        });
        
        //잘되는지 확인
        expect(newState).toEqual({
            users: [{ ...stubUser, logged_in: true }]
        });

        newState = reducer(newState, {
            type: actionTypes.SET_LOGIN,
            targetUser: stubUser,
        });
        expect(newState).toEqual({
            users: [{ ...stubUser, logged_in: false }]
        });


        //다른 객체넘겼을 때 안바뀌는지 확인
        newState = reducer(newState, {
            type: actionTypes.SET_LOGIN,
            targetUser: {id:2,email:'email2',password:'password2',logged_in:false},
        });
        
        expect(newState).toEqual({
            users: [{ ...stubUser, logged_in: false }]
        });
    });

    it('should get all Users', () => {
        const stubUsers = [
            { id: 1, email: 'email1', password: 'password1', logged_in:true },
            { id: 2, email: 'email2', password: 'password2', logged_in:false },
            { id: 3, email: 'email3', password: 'password3', logged_in:false }
        ];
        const newState = reducer(undefined, {
            type: actionTypes.GET_ALL_USERS,
            users: stubUsers,
        });
        expect(newState).toEqual({
            users: stubUsers
        });
    });
})

