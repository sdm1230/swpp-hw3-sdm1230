import * as actionTypes from '../actions/actionTypes';

const initialState={
    users: []
};

const reducer=(state=initialState, action)=>{
    switch(action.type){
        case actionTypes.GET_ALL_USERS:
            return {...state, users: action.users};

        case actionTypes.SET_LOGIN:
            const modified = state.users.map((user)=>{
                if(user.id === action.targetUser.id){
                    return { ...user, logged_in: !user.logged_in }
                } else {
                    return { ...user}
                }
            });
            return {...state, users: modified};

        default:
            break;
    }
    return state;
}

export default reducer;