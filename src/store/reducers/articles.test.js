import React from 'react';

import reducer from './articles';
import * as actionTypes from '../actions/actionTypes';

const stubArticle = {id: 1, title: 'title', content: 'content', author_id: 1};

describe('articlesReducer', () => {
  it('should return default state', () => {
    const newState = reducer(undefined, {}); // initialize
    expect(newState).toEqual({articles: [], selectedArticle: {}});
  });

  it('should add Article', () => {
    const newState = reducer(undefined, {
      type: actionTypes.ADD_ARTICLE,
      id: stubArticle.id,
      title: stubArticle.title,
      content: stubArticle.content,
      author_id: stubArticle.author_id,
    });
    expect(newState).toEqual({
      articles: [stubArticle],
      selectedArticle: {}
    });
  });

  it('should delete Article', () => {
    const stubInitialState = {
      articles: [stubArticle],
      selectedArticle: {},
    };
    const newState = reducer(stubInitialState, {
      type: actionTypes.DELETE_ARTICLE,
      targetID: 1,
    });
    expect(newState).toEqual({
      articles: [],
      selectedArticle: {}
    });
  });

  it('should set Article', () => {
    const stubInitialState = {
      articles: [stubArticle],
      selectedArticle: {},
    };
    let newState = reducer(stubInitialState, {
        type: actionTypes.SET_ARTICLE,
        targetArticle: stubArticle,
        newTitle : 'newTitle',
        newContent : 'newContent',
    });
    //잘되는지 확인
    expect(newState).toEqual({
      articles: [{...stubArticle, title: 'newTitle',content:'newContent'}],
      selectedArticle: {}}
    );
    //다른 객체넘겼을 때 안바뀌는지 확인
    newState = reducer(newState, {
        type: actionTypes.SET_ARTICLE,
        targetArticle: {id:2,title:"a",content:"b",author_id:1},
        newTitle : 'newTitle2',
        newContent : 'newContent2',
    });
    expect(newState).toEqual({
      articles: [{...stubArticle, title: 'newTitle', content:'newContent'}],
      selectedArticle: {}}
    );
  });

  it('should get Article', () => {
    const stubSelectedArticle = {id: 1, author_id:1,title: 'title', content: 'content'};
    const newState = reducer(undefined, {
      type: actionTypes.GET_ARTICLE,
      target: stubSelectedArticle,
    });
    expect(newState).toEqual({
      articles: [],
      selectedArticle: stubSelectedArticle
    });
  });

  it('should get all Articles', () => {
    const stubArticles = [
      {id: 1, title: '1', content: '1', author_id: 1},
      {id: 2, title: '2', content: '2', author_id: 1},
      {id: 3, title: '3', content: '3', author_id: 2},
    ];
    const newState = reducer(undefined, {
      type: actionTypes.GET_ALL,
      articles: stubArticles,
    });
    expect(newState).toEqual({
      articles: stubArticles,
      selectedArticle: {},
    });
  });
})

