
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {createBrowserHistory} from 'history'; 
import { shallow,mount } from 'enzyme';

import { getMockStore } from './test-utils/mocks';
import {Provider} from 'react-redux';

const mockStore = getMockStore([{ articles: []}, {users:[]},{comments:[] }]);

describe('App', () => {
  let app;

  beforeEach(() => {
    app = (
      <Provider store={mockStore}>
        <App />
      </Provider>
    )
  });
  /*
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });*/

  it('should render', () => {
    const component = mount(app);
    expect(component.find('.App').length).toBe(1);
  });

  it('should be redirected to error page', () => {
    
    const history = createBrowserHistory();
    history.push('/aaa');
    jest.spyOn(history, "push");
    const component = mount(app);
    
    expect(component.find('h1').text()).toBe('Not Found');
  });
});