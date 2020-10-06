import * as actionTypes from '../actions/actionTypes';

const initialState={
    comments: []
};

const reducer=(state=initialState, action)=>{
    switch(action.type){
        
        case actionTypes.GET_COMMENTS:
            return {...state, comments: action.comments};
        
        case actionTypes.SET_COMMENT:
            const modified = state.comments.map((comment)=>{
                if(comment.id === action.targetComment.id){
                    return {...comment, content: action.newContent}
                } else {
                    return {...comment}
                }
            });
            return {...state, comments: modified};

        case actionTypes.DELETE_COMMENT:
            const deleted = state.comments.filter((comment)=>{
                return comment.id !== action.targetID;
            });
            return {...state, comments: deleted}
        
        case actionTypes.POST_COMMENT:
            const newComment ={
                id: action.id,
                article_id: action.article_id,
                author_id : action.author_id,
                content: action.content,
            };
            return {...state, comments: [...state.comments, newComment]};

        default:
            break;
    }
    return state;
}

export default reducer;