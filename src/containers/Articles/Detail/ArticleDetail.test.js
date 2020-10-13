import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import ArticleDetail from './ArticleDetail';

import { getMockStore } from '../../../test-utils/mocks';
import * as actionCreators from '../../../store/actions/articles';
import * as actionCreators_comments from '../../../store/actions/comments';
import * as actionCreators_user from '../../../store/actions/users';
import { createBrowserHistory } from 'history';

const stubInitialState = [
    {
        articles: [
            { author_id: 1, title: "TEST_TITLE_1", content: "TEST_CONTENT_1", id: 1 }
        ],
        selectedArticle: {
            id: 1,
            author_id: 1,
            title: "TEST_TITLE_1",
            content: "TEST_CONTENT_1"
        }
    },
    {
        users: [
            { id: 1, email: 'TEST_EMAIL_1', password: 'TEST_PASSWORD_1', name: 'TEST_NAME_1', logged_in: true },
        ],
    },
    {
        comments: [
            { content: "TEST_COMMENT_1", author_id: 1, article_id: 1, id: 1 },
        ]
    }
];

const mockStore = getMockStore(stubInitialState);

describe('<ArticleDetail />', () => {
    let articleDetail, spyGetComments;

    const history = createBrowserHistory();

    beforeEach(() => {
        articleDetail = (
            <Provider store={mockStore}>
                <BrowserRouter>
                    <Switch>
                        <Route path='/' exact render={() => <ArticleDetail match={{ params: { id: 1 } }} history={history} />} />
                        <Route path='/login' exact render={() => <h1>LoginPage</h1>} />
                        <Route path='/articles' exact render={() => <h1>ArticleList</h1>} />
                        <Route path='/articles/1/edit' exact render={() => <h1>ArticleEdit</h1>} />
                    </Switch>
                </BrowserRouter>
            </Provider>
        );
        stubInitialState[0].selectedArticle.id = 1;
        spyGetComments = jest.spyOn(actionCreators_comments, 'getComments').mockImplementation(() => { return dispatch => { }; });
    });
    afterEach(() => {
        history.push('/');
    })

    it('should render ArticleDetail being login', () => {
        const component = mount(articleDetail);
        const wrapper = component.find('.ArticleDetail');

        expect(wrapper.length).toBe(1);
        expect(component.find(ArticleDetail.WrappedComponent).instance().state.loginUser).toBe(stubInitialState[1].users[0]);

        expect(spyGetComments).toHaveBeenCalled();
    });

    it(`should set state properly on comment input`, () => {

        const content = 'TEST_COMMENT'
        const component = mount(articleDetail);
        const wrapper = component.find('#new-comment-content-input');
        wrapper.simulate('change', { target: { value: content } });
        const articleDetailInstance = component.find(ArticleDetail.WrappedComponent).instance();

        expect(articleDetailInstance.state.comment).toEqual(content);
    });

    it(`should call 'postComment'`, () => {
        const spyPostComment = jest.spyOn(actionCreators_comments, 'postComment').mockImplementation((comment) => { return dispatch => { }; });
        const component = mount(articleDetail);
        const wrapper = component.find('#confirm-create-comment-button');

        component.find('#new-comment-content-input').simulate('change', { target: { value: 'TEST_COMMENT' } });

        wrapper.simulate('click');

        expect(spyPostComment).toHaveBeenCalledTimes(1);
    });

    it(`should fail 'setComment'`, () => {
        const spySetComment = jest.spyOn(actionCreators_comments, 'setComment').mockImplementation((comment) => { return dispatch => { }; });
        const spyPrompt = jest.spyOn(window, 'prompt').mockImplementation(() => "")

        const component = mount(articleDetail);
        const wrapper = component.find('#edit-comment-button');

        wrapper.simulate('click');

        expect(spySetComment).toHaveBeenCalledTimes(0);
    });

    it(`should call 'setComment'`, () => {
        const spySetComment = jest.spyOn(actionCreators_comments, 'setComment').mockImplementation((comment) => { return dispatch => { }; });
        const spyPrompt2 = jest.spyOn(window, 'prompt').mockImplementation(() => "TEST_Edit_COMMENT")

        const component = mount(articleDetail);
        const wrapper = component.find('#edit-comment-button');

        wrapper.simulate('click');

        expect(spySetComment).toHaveBeenCalledTimes(1);
    });



    it(`should call 'deleteComment'`, () => {

        const spyDeleteComment = jest.spyOn(actionCreators_comments, 'deleteComment').mockImplementation((comment) => { return dispatch => { }; });
        const component = mount(articleDetail);
        const wrapper = component.find('#delete-comment-button');

        wrapper.simulate('click');

        expect(spyDeleteComment).toHaveBeenCalledTimes(1);

    });

    it(`should call 'setArticle'`, () => {
        const spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(path => { });
        const component = mount(articleDetail);
        const wrapper = component.find('#edit-article-button');

        wrapper.simulate('click');
        expect(spyHistoryPush).toHaveBeenCalledWith('/articles/1/edit');

    });

    it(`should call 'deleteArticle'`, () => {
        const spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(path => { });
        const component = mount(articleDetail);
        const wrapper = component.find('#delete-article-button');

        wrapper.simulate('click');

        expect(spyHistoryPush).toHaveBeenCalledWith('/articles');
    });

    it('should back to articlesList', () => {
        const spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(path => { });

        const component = mount(articleDetail);
        const wrapper = component.find('#back-detail-article-button');

        wrapper.simulate('click');

        expect(spyHistoryPush).toHaveBeenCalledWith('/articles');
    });

    it('should fail ArticleDetail selectedArticle', () => {
        const spyGetArticle = jest.spyOn(actionCreators, 'getArticle').mockImplementation(() => { return dispatch => { }; });
        stubInitialState[0].selectedArticle.id = 0;

        const component = mount(articleDetail);

        expect(spyGetArticle).toHaveBeenCalled();
    });

    it(`should success 'logOut'`, () => {
        const spyLogOut = jest.spyOn(actionCreators_user, 'setUser')
            .mockImplementation(user => {
                return dispatch => {
                    return new Promise((resolve, reject) => {
                        const result = {
                            status: 200,
                            data: null
                        };
                        resolve(result);
                    });
                }
            });
        const component = mount(articleDetail);
        const wrapper = component.find('#logout-button');

        wrapper.simulate('click');
        stubInitialState[1].users[0].logged_in = false;

        expect(spyLogOut).toHaveBeenCalledTimes(1);
    });

    it('should redirect to loginPage', () => {
        const spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(path => { });
        stubInitialState[1].users[0].logged_in = false;
        const component = mount(articleDetail);
        expect(spyHistoryPush).toHaveBeenCalledWith('/articles');
    });

    it('should view when title is not empty ', () => {
        stubInitialState[0].selectedArticle.title = ""
        const component = mount(articleDetail);
        const wrapper = component.find('.ArticleDetail');

        expect(wrapper.length).toBe(1);
        stubInitialState[0].selectedArticle.title = "TEST_TITLE_1";
    });

});