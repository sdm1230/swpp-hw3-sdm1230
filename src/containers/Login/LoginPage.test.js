import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import LoginPage from './LoginPage';

import { getMockStore } from '../../test-utils/mocks';
import * as actionCreators from '../../store/actions/users';

const stubInitialState = {
  users: [
    {id: 1, email: 'TEST_EMAIL_1', password: 'TEST_PASSWORD_1',name:'TEST_NAME_1',logged_in:false},
  ]
};

const mockStore = getMockStore([{},stubInitialState,{}]);

describe('<LoginPage />', () => {
  let loginpage;

  beforeEach(() => {
    loginpage = (
      <Provider store={mockStore}>
        <BrowserRouter>
        <Switch>
          <Route path='/' exact component={LoginPage} />
          <Route path='/articles' exact component={LoginPage} />
        </Switch>
        </BrowserRouter>
      </Provider>
    );
  })

  it('should render LoginPage', () => {
    const component = mount(loginpage);
    const wrapper = component.find('.LoginPage');
    expect(wrapper.length).toBe(1);
  });
  
  it(`should set state properly on email input`, () => {
    const email = 'TEST_EMAIL'
    const component = mount(loginpage);
    const wrapper = component.find('input').at(0);
    wrapper.simulate('change', { target: { value: email } });
    const loginpageInstance = component.find(LoginPage.WrappedComponent).instance();
    expect(loginpageInstance.state.email).toEqual(email);
    expect(loginpageInstance.state.password).toEqual('');
  });

  it(`should set state properly on password input`, () => {
    const password = 'TEST_PASSWORD'
    const component = mount(loginpage);
    const wrapper = component.find('input').at(1);
    wrapper.simulate('change', { target: { value: password } });
    const loginpageInstance = component.find(LoginPage.WrappedComponent).instance();
    expect(loginpageInstance.state.email).toEqual('');
    expect(loginpageInstance.state.password).toEqual(password);
  });

  it(`should fail 'loginHandler'`, () => {
    const alerting = jest.spyOn(window,'alert').mockImplementation(()=>null);
    const spyLoginHandler = jest.spyOn(actionCreators, 'setUser')
      .mockImplementation(user => { return dispatch => {}; });
    const component = mount(loginpage);
    const wrapper = component.find('button');
    
    wrapper.simulate('click');
    expect(alerting).toHaveBeenCalledTimes(1);
    expect(spyLoginHandler).toHaveBeenCalledTimes(0);
  });

  it(`should success 'loginHandler'`, () => {
    const spyLoginHandler = jest.spyOn(actionCreators, 'setUser')
      .mockImplementation(user => { return dispatch => {}; });
    const component = mount(loginpage);
    const wrapper = component.find('button');
    
    component.find('input').at(0).simulate('change', { target: { value: stubInitialState.users[0].email } });
    component.find('input').at(1).simulate('change', { target: { value: stubInitialState.users[0].password } });
    wrapper.simulate('click');

    expect(spyLoginHandler).toHaveBeenCalledTimes(1);
  });

  it('should redirect to ArticlePage', () => {
    stubInitialState.users[0].logged_in=true;
    const component = mount(loginpage);
    const wrapper = component.find('Redirect');
    expect(wrapper.length).toBe(1);
  });
});


