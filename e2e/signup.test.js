import {Selector} from 'testcafe';

const TEST_URL = process.env.TEST_URL;

const randomstring = require('randomstring');

const username = randomstring.generate();
const email = `${username}@test.com`;
const password = 'greaterthanten';


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


test(`should allow a user to sign up`, async (t) => {

  // signup user
  await t
    .navigateTo(`${TEST_URL}/signup`)
    .typeText('input[name="username"]', username)
    .typeText('input[name="email"]', email)
    .typeText('input[name="password"]', password)
    .click(Selector('input[type="submit"]'));

  // assert user is redirected to '/'
  // assert '/' is displayed properly
  const tableRow = Selector('td').withText(username).parent();
  await t
    .expect(Selector('H1').withText('All Users').exists).ok()
    .expect(tableRow.child().withText(username).exists).ok()
    .expect(tableRow.child().withText(email).exists).ok()
    .expect(Selector('a').withText('Profile').exists).ok()
    .expect(Selector('a').withText('Sign Out').exists).ok()
    .expect(Selector('a').withText('Sign Up').exists).notOk()
    .expect(Selector('a').withText('Sign In').exists).notOk();
});


test(`should throw an error if the username is taken`, async (t) => {

  // signup user with duplicate username
  await t
    .navigateTo(`${TEST_URL}/signup`)
    .typeText('input[name="username"]', username)
    .typeText('input[name="email"]', `${email}unique`)
    .typeText('input[name="password"]', password)
    .click(Selector('input[type="submit"]'));

  // assert user signup failed
  await t
    .expect(Selector('H1').withText('Signup').exists).ok()
    .expect(Selector('a').withText('Profile').exists).notOk()
    .expect(Selector('a').withText('Sign Out').exists).notOk()
    .expect(Selector('a').withText('Sign Up').exists).ok()
    .expect(Selector('a').withText('Sign In').exists).ok()
    .expect(Selector('.alert-success').exists).notOk()
    .expect(Selector('.alert-danger').withText(
      'signup failed.').exists).ok();
});


test(`should throw an error if the email is taken`, async (t) => {

  // signup user with duplicate email
  await t
    .navigateTo(`${TEST_URL}/signup`)
    .typeText('input[name="username"]', username)
    .typeText('input[name="email"]', `${email}unique`)
    .typeText('input[name="password"]', password)
    .click(Selector('input[type="submit"]'));

  // assert user signup failed
  await t
    .expect(Selector('H1').withText('Signup').exists).ok()
    .expect(Selector('a').withText('Profile').exists).notOk()
    .expect(Selector('a').withText('Sign Out').exists).notOk()
    .expect(Selector('a').withText('Sign Up').exists).ok()
    .expect(Selector('a').withText('Sign In').exists).ok()
    .expect(Selector('.alert-success').exists).notOk()
    .expect(Selector('.alert-danger').withText(
      'signup failed.').exists).ok();
});
