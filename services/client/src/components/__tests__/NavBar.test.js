import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';

import {MemoryRouter as Router} from 'react-router-dom';
import NavBar from '../NavBar';


const title = 'NavBar title';

test('NavBar renders properly for unauthenticated user', () => {
  const wrapper = shallow(<NavBar title={title} isAuthenticated={false}/>);
  const span = wrapper.find('span');
  expect(span.length).toBe(1);
  expect(span.get(0).props.children).toBe(title);
  const NavItems = wrapper.find('NavItem');
  expect(NavItems.length).toBe(4);
  expect(NavItems.get(0).props.children).toBe('Home');
  expect(NavItems.get(1).props.children).toBe('About');
  expect(NavItems.get(2).props.children).toBe('Signup');
  expect(NavItems.get(3).props.children).toBe('Signin');
});


test('NavBar renders properly for authenticated user', () => {
  const wrapper = shallow(<NavBar title={title} isAuthenticated={true}/>);
  const span = wrapper.find('span');
  expect(span.length).toBe(1);
  expect(span.get(0).props.children).toBe(title);
  const NavItems = wrapper.find('NavItem');
  expect(NavItems.length).toBe(4);
  expect(NavItems.get(0).props.children).toBe('Home');
  expect(NavItems.get(1).props.children).toBe('About');
  expect(NavItems.get(2).props.children).toBe('Profile');
  expect(NavItems.get(3).props.children).toBe('Signout');
})


test('NavBar renders a snapshot properly', () => {
  const tree = renderer.create(
    <Router location="/">
      <NavBar title={title}/>
    </Router>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
