import React from 'react';
import { shallow } from 'enzyme';
import Comment from './Comment';

describe('<Comment />', () => {
  it('should render without errors', () => {
    const component = shallow(<Comment />);
    const wrapper = component.find('.Comment');
    expect(wrapper.length).toBe(1);
  });
});
