import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import ArticleCreate from './ArticleCreate';

import { getMockStore } from '../../../test-utils/mocks';
import * as actionCreators from '../../../store/actions/articles';
import * as actionCreators_user from '../../../store/actions/users';
import { createBrowserHistory } from 'history';

const stubInitialState = [
    {
        articles: [
            { author_id: 1, title: "TEST_TITLE_1", content: "TEST_CONTENT_1", id: 1 }
        ],
        selectedArticle: {
            id: 2,
            author_id: 1,
            title: "TEST_NEW_TITLE",
            content: "TEST_NEW_CONTENT"
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

describe('<ArticleCreate />', () => {
    let articleCreate;

    const history=createBrowserHistory();

    beforeEach(() => {
        articleCreate = (
            <Provider store={mockStore}>
                <BrowserRouter>
                    <Switch>
                        <Route path='/' exact component={ArticleCreate} />
                        <Route path='/login' exact render={() => <h1>LoginPage</h1>} />
                        <Route path='/articles' exact render={() => <h1>ArticleList</h1>} />
                        <Route path='/articles/2' exact render={() => <h1>ArticleDetail</h1>} />
                    </Switch>
                </BrowserRouter>
            </Provider>
        );
        history.push('/');
    })
    

    it('should render articleCreate being login', () => {
        const component = mount(articleCreate);
        const wrapper = component.find('.NewArticle');
        expect(wrapper.length).toBe(1);
        expect(component.find(ArticleCreate.WrappedComponent).instance().state.loginUser).toBe(stubInitialState[1].users[0]);
    });

    it(`should call 'handleClickPreviewTab'`, () => {
        const component = mount(articleCreate);
        const wrapper = component.find('#preview-tab-button');
        const articleCreateInstance = component.find(ArticleCreate.WrappedComponent).instance();
        wrapper.simulate('click');
        expect(articleCreateInstance.state.selectedWriteTab).toEqual(false);
        expect(articleCreateInstance.state.selectedPreviewTab).toEqual(true);
    });

    it(`should call 'handleClickWriteTab'`, () => {
        const component = mount(articleCreate);
        const wrapper = component.find('#write-tab-button');
        const articleCreateInstance = component.find(ArticleCreate.WrappedComponent).instance();
        wrapper.simulate('click');
        expect(articleCreateInstance.state.selectedWriteTab).toEqual(true);
        expect(articleCreateInstance.state.selectedPreviewTab).toEqual(false);
    });

    it(`should set state properly on title input`, () => {
        const title = 'TEST_NEW_TITLE'
        const component = mount(articleCreate);
        const wrapper = component.find('#article-title-input');
        wrapper.simulate('change', { target: { value: title } });
        const articleCreateInstance = component.find(ArticleCreate.WrappedComponent).instance();
        expect(articleCreateInstance.state.title).toEqual(title);
        expect(articleCreateInstance.state.content).toEqual('');
    });

    it(`should set state properly on content input`, () => {
        const content = 'TEST_NEW_CONTENT'
        const component = mount(articleCreate);
        const wrapper = component.find('#article-content-input');
        wrapper.simulate('change', { target: { value: content } });
        const articleCreateInstance = component.find(ArticleCreate.WrappedComponent).instance();
        expect(articleCreateInstance.state.title).toEqual('');
        expect(articleCreateInstance.state.content).toEqual(content);
    });

    it(`should call 'postArticle' and go to DetailPage after posting`, () => {
        const spyPostArticle = jest.spyOn(actionCreators, 'postArticle').mockImplementation((article) => { return dispatch => { }; });
        const history = createBrowserHistory();
        const component = mount(articleCreate);
        const wrapper = component.find('#confirm-create-article-button');

        component.find('#article-title-input').simulate('change', { target: { value: 'TEST_NEW_TITLE' } });
        component.find('#article-content-input').simulate('change', { target: { value: 'TEST_NEW_CONTENT' } });

        wrapper.simulate('click');
        expect(spyPostArticle).toHaveBeenCalledTimes(1);
        expect(component.find('h1').text()).toBe('ArticleDetail');
        history.push('/');
    });

    it('should back to articles', () => {
        const history = createBrowserHistory();

        const component = mount(articleCreate);
        const wrapper = component.find('#back-create-article-button');
        wrapper.simulate('click');
        expect(component.find('h1').text()).toBe('ArticleList');
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
        const component = mount(articleCreate);
        const wrapper = component.find('#logout-button');

        wrapper.simulate('click');
        stubInitialState[1].users[0].logged_in = false;

        expect(spyLogOut).toHaveBeenCalledTimes(1);
        history.push('/');
    });

    it('should redirect to loginPage', () => {
        stubInitialState[1].users[0].logged_in = false;
        const component = mount(articleCreate);
        
        expect(component.find('h1').text()).toBe('LoginPage');
    });

});