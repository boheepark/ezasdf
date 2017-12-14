import React from 'react';
import {shallow} from "enzyme";
import renderer from 'react-test-renderer';

import UserList from "../UserList";


const users = [
  {
    'active': true,
    'email': 'test@email.com',
    'id': 1,
    'username': 'test'
  },
  {
    'active': true,
    'email': 'test2@email.com',
    'id': 2,
    'username': 'test2'
  }
];


test('UserList renders properly', () => {
  const wrapper = shallow(<UserList users={users}/>);
  const table = wrapper.find('Table');
  expect(table.length).toBe(1);
});


test('UserList renders a snapshot properly', () => {
  const tree = renderer.create(<UserList users={users}/>).toJSON();
  expect(tree).toMatchSnapshot();
})
