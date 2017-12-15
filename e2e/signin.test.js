import {Selector} from 'testcafe';

const randomstring = require('randomstring');

const username = randomstring.generate();
const email = `${username}@email.com`;
const password = 'greaterthanten';

const TEST_URL = process.env.TEST_URL;


fixture('/signin').page(`${TEST_URL}/signin`);


test(`should display the sign in form`, async (t) => {
  await t
    .navigateTo(`${TEST_URL}/signin`)
    .expect(Selector('H1').withText('Signin').exists).ok()
    .expect(Selector('form').exists).ok()
    .expect(Selector('input[name="email"]').exists).ok()
    .expect(Selector('input[name="password"]').exists).ok()
    .expect(Selector('input[disabled]').exists).ok()
    .expect(Selector('.validation-list').exists).ok()
    .expect(Selector('.validation-list > .error').nth(0).withText(
      'Email must be greater than 5 characters.').exists).ok()
    .expect(Selector('.validation-list > .error').nth(1).withText(
      'Email must be a valid email address.').exists).ok()
    .expect(Selector('.validation-list > .error').nth(2).withText(
      'Password must be greater than 10 characters.').exists).ok();
});


test(`should validate the password field`, async (t) => {
  await t
    .navigateTo(`${TEST_URL}/signin`)
    .expect(Selector('H1').withText('Signin').exists).ok()
    .expect(Selector('form').exists).ok()
    .expect(Selector('input[disabled]').exists).ok()
    .expect(Selector('.validation-list > .error').nth(2).withText(
      'Password must be greater than 10 characters.').exists).ok()
    .typeText('input[name="password"]', password)
    .expect(Selector('.validation-list').exists).ok()
    .expect(Selector('.validation-list > .error').nth(2).withText(
      'Password must be greater than 10 characters.').exists).notOk()
    .expect(Selector('.validation-list > .success').nth(0).withText(
      'Password must be greater than 10 characters.').exists).ok()
    .click(Selector('a').withText('Sign Up'))
    .expect(Selector('.validation-list > .error').nth(3).withText(
      'Password must be greater than 10 characters.').exists).ok();
});


test(`should allow a user to sign in`, async (t) => {

  // signup user
  await t
    .navigateTo(`${TEST_URL}/signup`)
    .typeText('input[name="username"]', username)
    .typeText('input[name="email"]', email)
    .typeText('input[name="password"]', password)
    .click(Selector('input[type="submit"]'));

  // sign a user out
  await t
    .click(Selector('a').withText('Sign Out'));

  // sign a user in
  await t
    .navigateTo(`${TEST_URL}/signin`)
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
    .expect(Selector('a').withText('Sign In').exists).notOk()
    .expect(Selector('.alert-success').withText('Welcome!').exists).ok();

  // sign a user out
  await t
    .click(Selector('a').withText('Sign Out'));

  // assert '/signout' is displayed properly
  await t
    .expect(Selector('p').withText('You are now signed out').exists).ok()
    .expect(Selector('a').withText('Profile').exists).notOk()
    .expect(Selector('a').withText('Sign Out').exists).notOk()
    .expect(Selector('a').withText('Sign Up').exists).ok()
    .expect(Selector('a').withText('Sign In').exists).ok();
});


test(`should throw an error if the credentials are invalid`, async (t) => {

  // attempt to sign in with invalid email
  await t
    .navigateTo(`${TEST_URL}/signin`)
    .typeText('input[name="email"]', 'invalid@email.com')
    .typeText('input[name="password"]', password)
    .click(Selector('input[type="submit"]'));

  // assert user signin failed
  await t
    .expect(Selector('H1').withText('Signin').exists).ok()
    .expect(Selector('a').withText('Profile').exists).notOk()
    .expect(Selector('a').withText('Sign Out').exists).notOk()
    .expect(Selector('a').withText('Sign Up').exists).ok()
    .expect(Selector('a').withText('Sign In').exists).ok()
    .expect(Selector('.alert-success').exists).notOk()
    .expect(Selector('.alert-danger').withText(
      'Signin failed.').exists).ok();

  // attempt to sign in with invalid password
  await t
    .navigateTo(`${TEST_URL}/signin`)
    .typeText('input[name="email"]', email)
    .typeText('input[name="password"]', 'invalidpassword')
    .click(Selector('input[type="submit"]'));

  // assert user signin failed
  await t
    .expect(Selector('H1').withText('Signin').exists).ok()
    .expect(Selector('a').withText('Profile').exists).notOk()
    .expect(Selector('a').withText('Sign Out').exists).notOk()
    .expect(Selector('a').withText('Sign Up').exists).ok()
    .expect(Selector('a').withText('Sign In').exists).ok()
    .expect(Selector('.alert-success').exists).notOk()
    .expect(Selector('.alert-danger').withText(
      'Signin failed.'
    ).exists).ok();
});
