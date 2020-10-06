import * as actionTypes from '../actions/actionTypes';

const initialState = {
    articles: [],
    selectedArticle:{},
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ALL:
            return { ...state, articles: action.articles };
        case actionTypes.ADD_ARTICLE:
            const newArticle = {
                id: action.id,
                author_id: action.author_id,
                title: action.title,
                content: action.content,
            }
            return { ...state, articles: [...state.articles, newArticle] };
        case actionTypes.GET_ARTICLE:
            return { ...state, selectedArticle: action.target };

        case actionTypes.SET_ARTICLE:
            const modified = state.articles.map((article) => {
                if (article.id === action.targetArticle.id) {
                    return { ...article, title:action.newTitle,content: action.newContent }
                } else {
                    return { ...article }
                }
            });
            return { ...state, articles: modified };
        case actionTypes.DELETE_ARTICLE:
            const deleted = state.articles.filter((article) => {
                return article.id !== action.targetID;
            });
            return { ...state, articles: deleted }

        default:
            break;
    }
    return state;
}

export default reducer;