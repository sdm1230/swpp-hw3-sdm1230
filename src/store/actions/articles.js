import * as actionTypes from './actionTypes'
import axios from 'axios';

export const getArticles_ = (articles) =>{
    return {
        type: actionTypes.GET_ALL, articles : articles
    };
}

export const getArticles=()=>{
    return dispatch =>{
        return axios.get('/api/articles')
            .then(res => dispatch(getArticles_(res.data)));
    }
}

export const postArticle_ = (article) =>{
    return {
        type: actionTypes.ADD_ARTICLE, 
        id: article.id,
        author_id: article.author_id,
        title: article.title,
        content : article.content
    };
};

export const postArticle= (article)=>{
    return dispatch =>{
        return axios.post('/api/articles', article)
            .then(res => {
                dispatch(postArticle_(res.data));
                dispatch(getArticle_(res.data));
            });
    }
}

export const deleteArticle_ = (id) =>{
    return {
        type: actionTypes.DELETE_ARTICLE, 
        targetID: id,
    };
};

export const deleteArticle= (id)=>{
    return dispatch =>{
        return axios.delete('/api/articles/'+ id)
            .then(res => dispatch(deleteArticle_(id)));
    }
}

export const getArticle_ = (article) =>{
    return {
        type: actionTypes.GET_ARTICLE, 
        target: article
    };
};

export const getArticle= (id)=>{
    return dispatch =>{
        return axios.get('/api/articles/'+id)
            .then(res => dispatch(getArticle_(res.data)));
    }
}

export const setArticle_ = (article, newTitle,newContent) =>{
    return {
        type: actionTypes.SET_ARTICLE,
        targetArticle: article,
        newTitle : newTitle,
        newContent : newContent,
    }
}

export const setArticle = (article, newTitle,newContent) =>{
    return dispatch =>{
        return axios.put('/api/articles/'+article.id,{...article,title:newTitle,content:newContent})
            .then(res=> {
                dispatch(setArticle_(article,newTitle,newContent))
            })
    }
}
