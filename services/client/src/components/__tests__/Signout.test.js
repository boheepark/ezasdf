import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';

import {MemoryRouter as Router} from 'react-router-dom';
import Signout from '../Signout';


const signout = jest.fn();


test('Signout renders properly', () => {
  const wrapper = shallow(<Signout signout={signout}/>);
  const element = wrapper.find('p');
  expect(element.length).toBe(1);
  expect(element.get(0).props.children[0]).toContain('You are now signed out.');
});


test('Signout renders a snapshot properly', () => {
  const tree = renderer.create(
    <Router>
      <Signout signout={signout}/>
    </Router>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
