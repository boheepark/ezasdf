import {Selector} from 'testcafe';
import randomstring from 'randomstring';
// const randomstring = require('randomstring');


const USERNAME = randomstring.generate();
const EMAIL = `${USERNAME}@email.com`;
const PASSWORD = 'greaterthanten';


const TEST_URL = process.env.TEST_URL;
fixture('/signup').page(`${TEST_URL}/signup`);


test(`should display the signup form`, async (t) => {
  await t
    .navigateTo(`${TEST_URL}/signup`)
    .expect(Selector('H1').withText('Signup').exists).ok()
    .expect(Selector('form').exists).ok()
    .expect(Selector('input[name="username"]').exists).ok()
    .expect(Selector('input[name="email"]').exists).ok()
    .expect(Selector('input[name="password"]').exists).ok()
    .expect(Selector('input[disabled]').exists).ok()
    .expect(Selector('.validation-list').exists).ok()
    .expect(Selector('.validation-list > .error').nth(0).withText(
      'Username must be greater than 5 characters.'
    ).exists).ok()
    .expect(Selector('.validation-list > .error').nth(1).withText(
      'Email must be greater than 5 characters.'
    ).exists).ok()
    .expect(Selector('.validation-list > .error').nth(2).withText(
      'Email must be a valid email address.'
    ).exists).ok()
    .expect(Selector('.validation-list > .error').nth(3).withText(
      'Password must be greater than 10 characters.'
    ).exists).ok();
});


test(`should validate the password field`, async (t) => {
  await t
    .navigateTo(`${TEST_URL}/signup`)
    .expect(Selector('H1').withText('Signup').exists).ok()
    .expect(Selector('form').exists).ok()
    .expect(Selector('input[disabled]').exists).ok()
    .expect(Selector('.validation-list').exists).ok()
    .expect(Selector('.validation-list > .error').nth(3).withText(
      'Password must be greater than 10 characters.'
    ).exists).ok()
    .typeText('input[name="password"]', PASSWORD)
    .expect(Selector('.validation-list > .error').nth(3).withText(
      'Password must be greater than 10 characters.'
    ).exists).notOk()
    .expect(Selector('.validation-list > .success').nth(0).withText(
      'Password must be greater than 10 characters.'
    ).exists).ok()
    .click(Selector('a').withText('Signin'))
    .click(Selector('a').withText('Signup'))
    .expect(Selector('.validation-list > .error').nth(3).withText(
      'Password must be greater than 10 characters.'
    ).exists).ok();
});


test(`should allow a user to signup`, async (t) => {

  // signup user
  await t
    .navigateTo(`${TEST_URL}/signup`)
    .typeText('input[name="username"]', USERNAME)
    .typeText('input[name="email"]', EMAIL)
    .typeText('input[name="password"]', PASSWORD)
    .click(Selector('input[type="submit"]'));

  // assert user is redirected to '/'
  // assert '/' is displayed properly
  const tr = Selector('td').withText(USERNAME).parent();
  await t
    .expect(Selector('H1').withText('All Users').exists).ok()
    .expect(tr.child().withText(USERNAME).exists).ok()
    .expect(tr.child().withText(EMAIL).exists).ok()
    .expect(Selector('a').withText('Profile').exists).ok()
    .expect(Selector('a').withText('Signout').exists).ok()
    .expect(Selector('a').withText('Signup').exists).notOk()
    .expect(Selector('a').withText('Signin').exists).notOk();
});


test(`should throw an error if the username is taken`, async (t) => {

  // signup user with duplicate username
  await t
    .navigateTo(`${TEST_URL}/signup`)
    .typeText('input[name="username"]', USERNAME)
    .typeText('input[name="email"]', `${EMAIL}unique`)
    .typeText('input[name="password"]', PASSWORD)
    .click(Selector('input[type="submit"]'));

  // assert user signup failed
  await t
    .expect(Selector('H1').withText('Signup').exists).ok()
    .expect(Selector('a').withText('Profile').exists).notOk()
    .expect(Selector('a').withText('Signout').exists).notOk()
    .expect(Selector('a').withText('Signup').exists).ok()
    .expect(Selector('a').withText('Signin').exists).ok()
    .expect(Selector('.alert-success').exists).notOk()
    .expect(Selector('.alert-danger').withText(
      'signup failed.'
    ).exists).ok();
});


test(`should throw an error if the email is taken`, async (t) => {

  // signup user with duplicate email
  await t
    .navigateTo(`${TEST_URL}/signup`)
    .typeText('input[name="username"]', `${USERNAME}unique`)
    .typeText('input[name="email"]', EMAIL)
    .typeText('input[name="password"]', PASSWORD)
    .click(Selector('input[type="submit"]'));

  // assert user signup failed
  await t
    .expect(Selector('H1').withText('Signup').exists).ok()
    .expect(Selector('a').withText('Profile').exists).notOk()
    .expect(Selector('a').withText('Signout').exists).notOk()
    .expect(Selector('a').withText('Signup').exists).ok()
    .expect(Selector('a').withText('Signin').exists).ok()
    .expect(Selector('.alert-success').exists).notOk()
    .expect(Selector('.alert-danger').withText(
      'signup failed.'
    ).exists).ok();
});
