import React from 'react';
import {shallow} from "enzyme";
import renderer from 'react-test-renderer';

import UserList from "../UserList";


const date = new Date(1482363367071);
const users = [
  {
    'id': 1,
    'username': 'test',
    'email': 'test@email.com',
    'active': true,
    'admin': false,
    'created_at': date.toUTCString()
  },
  {
    'id': 2,
    'username': 'test2',
    'email': 'test2@email.com',
    'active': true,
    'admin': false,
    'created_at': date.toUTCString()
  }
];


test('UserList renders properly', () => {
  const wrapper = shallow(<UserList users={users}/>);

  const h1 = wrapper.find('h1');
  expect(h1.get(0).props.children).toBe('All Users');

  const table = wrapper.find('Table');
  expect(table.length).toBe(1);
  expect(table.get(0).props.striped).toBe(true);
  expect(table.get(0).props.bordered).toBe(true);
  expect(table.get(0).props.condensed).toBe(true);
  expect(table.get(0).props.hover).toBe(true);

  const thead = wrapper.find('thead');
  expect(thead.length).toBe(1);

  const th = wrapper.find('th');
  expect(th.length).toBe(6);
  expect(th.get(0).props.children).toBe('User ID');
  expect(th.get(1).props.children).toBe('Username');
  expect(th.get(2).props.children).toBe('Email');
  expect(th.get(3).props.children).toBe('Active');
  expect(th.get(4).props.children).toBe('Admin');
  expect(th.get(5).props.children).toBe('Created Date');

  const tbody = wrapper.find('tbody');
  expect(tbody.length).toBe(1);
  expect(wrapper.find('tbody > tr').length).toBe(2);

  const td = wrapper.find('tbody > tr > td');
  expect(td.length).toBe(12);
  expect(td.get(0).props.children).toBe(1);
  expect(td.get(1).props.children).toBe('test');
  expect(td.get(2).props.children).toBe('test@email.com');
  expect(td.get(3).props.children).toBe('true');
  expect(td.get(4).props.children).toBe('false');
  expect(td.get(5).props.children).toBe(date.toUTCString());
});


test('UserList renders a snapshot properly', () => {
  const tree = renderer.create(<UserList users={users}/>).toJSON();
  expect(tree).toMatchSnapshot();
});
