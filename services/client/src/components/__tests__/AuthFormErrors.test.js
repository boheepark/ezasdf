import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import {MemoryRouter as Router} from 'react-router-dom';

import AuthFormErrors from '../authForm/AuthFormErrors';
import {signupFormRules, signinFormRules} from '../authForm/authForm-rules';


const data = [
  {
    formType: 'signup',
    formRules: signupFormRules
  },
  {
    formType: 'signin',
    formRules: signinFormRules
  }
];


describe('AuthFormErrors tests', () => {
  data.forEach((el) => {
    const component = <AuthFormErrors {...el} />;

    it(`${el.formType} errors render properly`, () => {
      const wrapper = shallow(component);
      const ul = wrapper.find('ul');
      expect(ul.length).toBe(1);
      const li = wrapper.find('li');
      expect(li.length).toBe(el.formRules.length);
      el.formRules.forEach((rule, i) => {
        expect(li.get(i).props.children).toContain(
          rule.message
        );
      });
    });

    it(`${el.formType} errors render a snapshot properly`, () => {
      const tree = renderer.create(
        <Router>
          <AuthFormErrors {...el} />
        </Router>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
