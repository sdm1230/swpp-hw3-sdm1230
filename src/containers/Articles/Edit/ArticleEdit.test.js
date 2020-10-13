import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import ArticleEdit from './ArticleEdit';

import { getMockStore } from '../../../test-utils/mocks';
import * as actionCreators from '../../../store/actions/articles';
import * as actionCreators_user from '../../../store/actions/users';
import {createBrowserHistory} from 'history'; 

const stubInitialState = [
    { 
        articles: [
            {author_id: 1, title: "TEST_TITLE_1", content: "TEST_CONTENT_1", id: 1}
        ],
        selectedArticle:{ 
            id: 1,
            author_id: 1,
            title: "TEST_TITLE_1",
            content: "TEST_CONTENT_1"
         } 
    },
    {
        users: [
            { id: 1, email: 'TEST_EMAIL_1', password: 'TEST_PASSWORD_1', name: 'TEST_NAME_1', logged_in: true },
        ]
    },
    {}
];

const mockStore = getMockStore(stubInitialState);

describe('<ArticleEdit />', () => {
    let articleEdit;

    const history = createBrowserHistory();

    beforeEach(() => {
        articleEdit = (
            <Provider store={mockStore}>
                <BrowserRouter>
                    <Switch>
                        <Route path='/' exact component={ArticleEdit} />
                        <Route path='/login' exact render={() => <h1>LoginPage</h1>} />
                        <Route path='/articles/1' exact render={() => <h1>ArticleDetail</h1>} />
                    </Switch>
                </BrowserRouter>
            </Provider>
        );
        history.push('/');
    })

    it('should render articleEdit being login', () => {
        const component = mount(articleEdit);
        const wrapper = component.find('.EditArticle');
        expect(wrapper.length).toBe(1);
        expect(component.find(ArticleEdit.WrappedComponent).instance().state.loginUser).toBe(stubInitialState[1].users[0]);
    });

    it(`should call 'handleClickPreviewTab'`, () => {
        const component = mount(articleEdit);
        const wrapper = component.find('#preview-tab-button');
        const articleEditInstance = component.find(ArticleEdit.WrappedComponent).instance();
        wrapper.simulate('click');
        expect(articleEditInstance.state.selectedWriteTab).toEqual(false);
        expect(articleEditInstance.state.selectedPreviewTab).toEqual(true);
    });

    it(`should call 'handleClickWriteTab'`, () => {
        const component = mount(articleEdit);
        const wrapper = component.find('#write-tab-button');
        const articleEditInstance = component.find(ArticleEdit.WrappedComponent).instance();
        wrapper.simulate('click');
        expect(articleEditInstance.state.selectedWriteTab).toEqual(true);
        expect(articleEditInstance.state.selectedPreviewTab).toEqual(false);
    });

    it(`should set state properly on title input`, () => {
        const title = 'TEST_EDIT_TITLE'
        const component = mount(articleEdit);
        const wrapper = component.find('#article-title-input');
        wrapper.simulate('change', { target: { value: title } });
        const articleEditInstance = component.find(ArticleEdit.WrappedComponent).instance();
        expect(articleEditInstance.state.title).toEqual(title);
        expect(articleEditInstance.state.content).toEqual(stubInitialState[0].selectedArticle.content);
    });

    it(`should set state properly on content input`, () => {
        const content = 'TEST_EDIT_CONTENT'
        const component = mount(articleEdit);
        const wrapper = component.find('#article-content-input');
        wrapper.simulate('change', { target: { value: content } });
        const articleEditInstance = component.find(ArticleEdit.WrappedComponent).instance();
        expect(articleEditInstance.state.title).toEqual(stubInitialState[0].selectedArticle.title);
        expect(articleEditInstance.state.content).toEqual(content);
    });

    it(`should call 'setArticle' and go to DetailPage after editing`, () => {
        const spyPostArticle = jest.spyOn(actionCreators, 'setArticle').mockImplementation((article) => { return dispatch => { }; });
        const history = createBrowserHistory();
        const component = mount(articleEdit);
        const wrapper = component.find('#confirm-edit-article-button');

        component.find('#article-title-input').simulate('change', { target: { value: 'TEST_EDIT_TITLE' } });
        component.find('#article-content-input').simulate('change', { target: { value: 'TEST_EDIT_CONTENT' } });
        
        wrapper.simulate('click');
        expect(spyPostArticle).toHaveBeenCalledTimes(1);
        expect(component.find('h1').text()).toBe('ArticleDetail');
        history.push('/');
    });

    it('should confirm-No during backing to articlesDetail', () => {
        const spyModify_No=jest.spyOn(window,'confirm').mockImplementation(()=>false);

        const component = mount(articleEdit);
        const wrapper = component.find('#back-edit-article-button');

        component.find('#article-title-input').simulate('change', { target: { value: 'TEST_EDIT_TITLE' } });
        component.find('#article-content-input').simulate('change', { target: { value: 'TEST_EDIT_CONTENT' } });
        wrapper.simulate('click');

        expect(component.find('h1').text()).toBe('ArticleEdit');
    });

    it('should confirm-Yes during backing to articlesDetail', () => {
        const history = createBrowserHistory();
        const spyModify_Yes=jest.spyOn(window,'confirm').mockImplementation(()=>true);

        const component = mount(articleEdit);
        const wrapper = component.find('#back-edit-article-button');

        component.find('#article-title-input').simulate('change', { target: { value: 'TEST_EDIT_TITLE' } });
        component.find('#article-content-input').simulate('change', { target: { value: 'TEST_EDIT_CONTENT' } });
        wrapper.simulate('click');

        expect(component.find('h1').text()).toBe('ArticleDetail');
        history.push('/');
    });

    it('should back to articlesDetail', () => {
        const history = createBrowserHistory();

        const component = mount(articleEdit);
        const wrapper = component.find('#back-edit-article-button');

        component.find('#article-title-input').simulate('change', { target: { value: 'TEST_TITLE_1' } });
        component.find('#article-content-input').simulate('change', { target: { value: 'TEST_CONTENT_1' } });
        wrapper.simulate('click');

        expect(component.find('h1').text()).toBe('ArticleDetail');
        history.push('/');
    });

    it(`should success 'logOut'`, () => {
        const history = createBrowserHistory();
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
        const component = mount(articleEdit);
        const wrapper = component.find('#logout-button');

        wrapper.simulate('click');
        stubInitialState[1].users[0].logged_in = false;

        expect(spyLogOut).toHaveBeenCalledTimes(1);
        history.push('/');
    });

   it('should redirect to loginPage', () => {
    stubInitialState[1].users[0].logged_in=false;
    const component = mount(articleEdit);
    expect(component.find('h1').text()).toBe('LoginPage');
  });

});