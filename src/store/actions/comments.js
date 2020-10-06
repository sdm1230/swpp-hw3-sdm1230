import * as actionTypes from './actionTypes'
import axios from 'axios';

export const postComment_ = (comment) =>{
    return {
        type: actionTypes.POST_COMMENT,
        id: comment.id,
        article_id: comment.article_id,
        author_id: comment.author_id,
        content: comment.content
    }
}

export const postComment = (comment) => {
    return dispatch => {
        return axios.post('/api/comments', comment)
            .then(res => dispatch(postComment_(res.data)));
    };
};

export const getComments_ = (comments) =>{
    return {
        type: actionTypes.GET_COMMENTS, 
        comments: comments
    };
};

export const getComments= ()=>{
    return dispatch =>{
        return axios.get('/api/comments')
            .then(res => dispatch(getComments_(res.data)));
    }
}


export const deleteComment_ = (id) =>{
    return {
        type: actionTypes.DELETE_COMMENT, 
        targetID: id,
    };
};

export const deleteComment= (id)=>{
    return dispatch =>{
        return axios.delete('/api/comments/'+ id)
            .then(res => dispatch(deleteComment_(id)));
    }
}

export const setComment_ = (comment,newContent) =>{
    return {
        type: actionTypes.SET_COMMENT,
        targetComment: comment,
        newContent : newContent,
    }
}

export const setComment = (comment,newContent) => {
    return dispatch => {
        return axios.put('/api/comments/'+comment.id,{...comment,content: newContent})
            .then(res => {
                dispatch(setComment_(comment,newContent));
            });
    };
};