import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';

import Form from '../Form';


const formData = {
  username: '',
  email: '',
  password: ''
};


test('Signup Form renders properly', () => {
  const component = <Form formType={'signup'} formData={formData}/>;
  const wrapper = shallow(component);
  const h1 = wrapper.find('h1');
  expect(h1.length).toBe(1);
  expect(h1.get(0).props.children).toBe('signup');
  const formGroup = wrapper.find('.form-group');
  expect(formGroup.length).toBe(3);
  expect(formGroup.get(0).props.children.props.name).toBe('username');
  expect(formGroup.get(0).props.children.props.value).toBe('');
  expect(formGroup.get(1).props.children.props.name).toBe('email');
  expect(formGroup.get(1).props.children.props.value).toBe('');
  expect(formGroup.get(2).props.children.props.name).toBe('password');
  expect(formGroup.get(2).props.children.props.value).toBe('');
});


test('Signin Form renders properly', () => {
  const component = <Form formType={'signin'} formData={formData}/>;
  const wrapper = shallow(component);
  const h1 = wrapper.find('h1');
  expect(h1.length).toBe(1);
  expect(h1.get(0).props.children).toBe('signin');
  const formGroup = wrapper.find('.form-group');
  expect(formGroup.length).toBe(2);
  expect(formGroup.get(0).props.children.props.name).toBe('email');
  expect(formGroup.get(0).props.children.props.value).toBe('');
  expect(formGroup.get(1).props.children.props.name).toBe('password');
  expect(formGroup.get(1).props.children.props.value).toBe('');
});


test('Signup Form renders a snapshot properly', () => {
  const component = <Form formType={'signup'} formData={formData}/>;
  const tree = renderer.create(component).toJSON();
  expect(tree).toMatchSnapshot();
});


test('Signin Form renders a snapshot properly', () => {
  const component = <Form formType={'signin'} formData={formData}/>;
  const tree = renderer.create(component).toJSON();
  expect(tree).toMatchSnapshot();
});
