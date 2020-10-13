import React from 'react';

import reducer from './comments';
import * as actionTypes from '../actions/actionTypes';

const stubComment = { article_id: 1, id: 1, content: 'comment', author_id: 1 };

describe('commentsReducer', () => {
    it('should return default state', () => {
        const newState = reducer(undefined, {}); // initialize
        expect(newState).toEqual({ comments: [] });
    });

    it('should post comment', () => {
        const newState = reducer(undefined, {
            type: actionTypes.POST_COMMENT,
            id: stubComment.id,
            article_id: stubComment.article_id,
            author_id: stubComment.author_id,
            content: stubComment.content,
        });
        expect(newState).toEqual({
            comments: [stubComment]
        });
    });

    it('should delete comment', () => {
        const stubInitialState = {
            comments: [stubComment]
        };
        const newState = reducer(stubInitialState, {
            type: actionTypes.DELETE_COMMENT,
            targetID: 1,
        });
        expect(newState).toEqual({
            comments: []
        });
    });

    it('should set comment', () => {
        const stubInitialState = {
            comments: [stubComment]
        };
        let newState = reducer(stubInitialState, {
            type: actionTypes.SET_COMMENT,
            targetComment: stubComment,
            newContent: 'newComment'
        });
        //잘되는지 확인
        expect(newState).toEqual({
            comments: [{ ...stubComment, content: 'newComment' }]
        }
        );
        //다른 객체넘겼을 때 안바뀌는지 확인
        newState = reducer(newState, {
            type: actionTypes.SET_COMMENT,
            targetComment: { id: 2, article_id: 1, content: "b", author_id: 1 },
            newContent: 'newComment2'
        });
        expect(newState).toEqual({
            comments: [{ ...stubComment, content: 'newComment' }]
        }
        );
    });

    it('should get all comments', () => {
        const stubComments = [
            { id: 1, content: '1', author_id: 1, article_id: 1 },
            { id: 2, content: '2', author_id: 1, article_id: 1 },
            { id: 3, content: '3', author_id: 2, article_id: 1 }
        ];
        const newState = reducer(undefined, {
            type: actionTypes.GET_COMMENTS,
            comments: stubComments,
        });
        expect(newState).toEqual({
            comments: stubComments
        });
    });
})

