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
    const component = <AuthFormErrors {...el.formRules} />;

    it(`${el.formType} errors render properly`, () => {
      const wrapper = shallow(component);
      const ul = wrapper.find('ul');
      expect(ul.length).toBe(1);
      const li = wrapper.find('li');
      expect(li.length).toBe(el.formRules.length);
      el.formRules.forEach((rule, i) => {
        expect(li.get(i).props.children).toContain(
          formRules[i].message
        );
      });
    });

    it(`${el.formType} errors render a snapshot properly`, () => {
      const tree = renderer.create(
        <Router>
          <AuthFormErrors {...el.formRules} />
        </Router>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
// const signupFormProps = {
//   formType: 'Signup',
//   formRules: signupFormRules
// };
// const signinFormProps = {
//   formType: 'Signin',
//   formRules: signinFormRules
// };
// test('AuthFormErrors (with signup form) renders properly', () => {
//   const wrapper = shallow(<AuthFormErrors {...signupFormRules} />);
//   const ul = wrapper.find('ul');
//   expect(ul.length).toBe(1);
//   const li = wrapper.find('li');
//   expect(li.length).toBe(4);
//   expect(li.get(0).props.children).toContain(
//     'Username must be greater than 5 characters.');
//   expect(li.get(1).props.children).toContain(
//     'Email must be greater than 5 characters.');
//   expect(li.get(2).props.children).toContain(
//     'Email must be a valid email address.');
//   expect(li.get(3).props.children).toContain(
//     'Password must be greater than 10 characters.');
// });


// test('AuthFormErrors (with signup form) renders a snapshot properly', () => {
//   const tree = renderer.create(
//     <Router>
//       <AuthFormErrors {...signupFormRules} />
//     </Router>
//   ).toJSON();
//   expect(tree).toMatchSnapshot();
// });


// test('AuthFormErrors (with signin form) renders properly', () => {
//   const wrapper = shallow(<AuthFormErrors {...signinFormRules} />);
//   const ul = wrapper.find('ul');
//   expect(ul.length).toBe(1);
//   const li = wrapper.find('li');
//   expect(li.length).toBe(2);
//   expect(li.get(0).props.children).toContain(
//     'Email is required.');
//   expect(li.get(1).props.children).toContain(
//     'Password is required.');
// });


// test('AuthFormErrors (with signin form) renders a snapshot properly', () => {
//   const tree = renderer.create(
//     <Router>
//       <AuthFormErrors {...signinFormRules} />
//     </Router>
//   ).toJSON();
//   expect(tree).toMatchSnapshot();
// });
