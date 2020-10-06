import * as actionTypes from './actionTypes'
import axios from 'axios';

export const getUsers_ = (users) =>{
    return {
        type: actionTypes.GET_ALL_USERS, users : users
    };
}

export const getUsers=()=>{
    return dispatch =>{
        return axios.get('/api/user')
            .then(res => dispatch(getUsers_(res.data)));
    }
}

export const setUser_ = (user) =>{
    return {
        type: actionTypes.SET_LOGIN,
        targetUser: user
    }
}

export const setUser = (user) => {
    return dispatch => {
        return axios.put('/api/user/'+user.id,{...user,logged_in: !user.logged_in})
            .then(res => {
                dispatch(setUser_(user));
            });
    };
};