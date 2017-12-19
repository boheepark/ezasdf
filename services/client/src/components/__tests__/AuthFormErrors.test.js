import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import {MemoryRouter as Router} from 'react-router-dom';

import AuthFormErrors from '../authForm/AuthFormErrors';
import {signupRules, signinRules} from '../authForm/authForm-rules';


const testData = [
  {
    form: 'signup',
    rules: signupRules
  },
  {
    form: 'signin',
    rules: signinRules
  }
];


describe('AuthFormErrors tests', () => {
  testData.forEach((el) => {
    const component = <AuthFormErrors {...el} />;

    it(`${el.form} form errors render properly`, () => {
      const wrapper = shallow(component);
      const ul = wrapper.find('ul');
      expect(ul.length).toBe(1);
      const li = wrapper.find('li');
      expect(li.length).toBe(el.rules.length);
      el.rules.forEach((rule, i) => {
        expect(li.get(i).props.children).toContain(
          rule.message
        );
      });
    });

    it(`${el.form} form errors render a snapshot properly`, () => {
      const tree = renderer.create(
        <Router>
          <AuthFormErrors {...el} />
        </Router>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
