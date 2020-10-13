import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import ArticleList from './ArticleList';
import { getMockStore } from '../../../test-utils/mocks';
import {createBrowserHistory} from 'history'; 

import * as actionCreators from '../../../store/actions/articles';
import * as actionCreators_user from '../../../store/actions/users';

jest.mock('../../../components/Article/Article', () => { // article component mocking
    return jest.fn(props => {
        return (
            <div className="spyArticle">
                <div className={'id'} ></div>
                <button className={'title'} onClick={props.clickDetail}>
                    {props.title}
                </button>
                <div className={'author'} ></div>
            </div>);
    });
});

const stubInitialState = [
    {
        articles: [
            { author_id: 1, title: "TEST_TITLE_1", content: "TEST_CONTENT_1", id: 1 },
            { author_id: 2, title: "TEST_TITLE_2", content: "TEST_CONTENT_2", id: 2 },
            { author_id: 1, title: "TEST_TITLE_3", content: "TEST_CONTENT_3", id: 3 }
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
            { id: 2, email: 'TEST_EMAIL_2', password: 'TEST_PASSWORD_2', name: 'TEST_NAME_2', logged_in: false },
        ]
    },
    {}
];

const mockStore = getMockStore(stubInitialState);

describe('<ArticleList />', () => {
    let articleList, spyGetArticles;

    const history = createBrowserHistory();

    beforeEach(() => {
        
        articleList = (
            <Provider store={mockStore}>
                <BrowserRouter>
                    <Switch>
                        <Route path='/' exact component={ArticleList} />
                        <Route path='/articles/1' exact render={()=><h1>ArticleDetail</h1>} />
                        <Route path='/articles/create' exact render={()=><h1>ArticleCreate</h1>} />
                        <Route path='/login' exact render={()=><h1>LoginPage</h1>} />
                    </Switch>
                </BrowserRouter>
            </Provider>
        );
        spyGetArticles = jest.spyOn(actionCreators, 'getArticles').mockImplementation(() => { return dispatch => { }; });
        history.push('/');
    })

    it('should render Articles', () => {
        const component = mount(articleList);
        const wrapper = component.find('.spyArticle');
        expect(wrapper.length).toBe(3);
        expect(wrapper.at(0).text()).toBe('TEST_TITLE_1');
        expect(wrapper.at(1).text()).toBe('TEST_TITLE_2');
        expect(wrapper.at(2).text()).toBe('TEST_TITLE_3');
        expect(spyGetArticles).toBeCalledTimes(1);
    });

    it(`should call 'clickArticleHandler'`, () => {
        const history = createBrowserHistory();
        const component = mount(articleList);
        const wrapper = component.find('.spyArticle .title').at(0);
        wrapper.simulate('click');
        expect(component.find('h1').text()).toBe("ArticleDetail");
        history.push('/');
    });

    it(`should go to 'ArticleCreate'`, () => {
        const history = createBrowserHistory();
        const component = mount(articleList);
        const wrapper = component.find('#create-article-button');
        wrapper.simulate('click');
        expect(component.find('h1').text()).toBe("ArticleCreate");
        history.push('/');
    });

    it(`should success 'logOut'`, () => {
        stubInitialState[1].users[0].logged_in=true;
        const history = createBrowserHistory();
        history.push('/');
        
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
        const component = mount(articleList);
        const wrapper = component.find('#logout-button');

        wrapper.simulate('click');
        
        expect(spyLogOut).toHaveBeenCalledTimes(1);
        history.push('/');
    });

    it('should redirect to loginPage', () => {
        const history = createBrowserHistory();
        stubInitialState[1].users[0].logged_in=false;
        const component = mount(articleList);
        expect(component.find('h1').text()).toBe('LoginPage');
        history.push('/');
      });

   
});

