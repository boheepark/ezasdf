import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';
import {MemoryRouter, Switch, Redirect} from 'react-router-dom';

import AuthForm from '../authForm/AuthForm';


const testData = [
  {
    form: 'signup',
    data: {
      username: '',
      email: '',
      password: ''
    },
    isAuthenticated: false,
    signin: jest.fn(),
  },
  {
    form: 'signin',
    data: {
      email: '',
      password: ''
    },
    isAuthenticated: false,
    signin: jest.fn(),
  }
];


describe('When not authenticated', () => {

  testData.forEach((el) => {
    const component = <AuthForm {...el}/>;

    it(`${el.form} Form renders properly`, () => {
      const wrapper = shallow(component);
      const h1 = wrapper.find('h1');
      expect(h1.length).toBe(1);
      expect(h1.get(0).props.children).toBe(el.form);
      const formGroup = wrapper.find('.form-group');
      expect(formGroup.length).toBe(Object.keys(el.data).length);
      expect(formGroup.get(0).props.children.props.name).toBe(
        Object.keys(el.data)[0]
      );
      expect(formGroup.get(0).props.children.props.value).toBe('');
    });

    it(`${el.form} Form should be disabled by default`, () => {
      const wrapper = shallow(component);
      const input = wrapper.find('input[type="submit"]');
      expect(input.get(0).props.disabled).toEqual(true);
    });

    it(`${el.form} Form submits the form properly`, () => {
      const wrapper = shallow(component);
      wrapper.instance().handleSubmit = jest.fn();
      wrapper.instance().validateForm = jest.fn();
      wrapper.update();
      const input = wrapper.find('input[type="email"]');
      expect(wrapper.instance().handleSubmit).toHaveBeenCalledTimes(0);
      input.simulate(
        'change',
        {
          target: {
            name: 'email',
            value: 'test@email.com'
          }
        }
      );
      wrapper.find('form').simulate('submit', el.data);
      expect(wrapper.instance().handleSubmit).toHaveBeenCalledWith(el.data);
      expect(wrapper.instance().handleSubmit).toHaveBeenCalledTimes(1);
      expect(wrapper.instance().validateForm).toHaveBeenCalledTimes(1);
    });

    it(`${el.form} Form renders a snapshot properly`, () => {
      const tree = renderer.create(component).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});


describe('When authenticated', () => {

  testData.forEach((el) => {
    const component = <AuthForm
      form={el.form}
      data={el.data}
      isAuthenticated={true}
    />;

    it(`${el.form} redirects properly`, () => {
      const wrapper = shallow(component);
      expect(wrapper.find('Redirect')).toHaveLength(1);
    });
  });
});
