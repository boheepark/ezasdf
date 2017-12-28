import {Selector} from 'testcafe';
import randomstring from 'randomstring';
// const randomstring = require('randomstring');


const USERNAME = randomstring.generate();
const EMAIL = `${USERNAME}@email.com`;
const PASSWORD = 'greaterthanten';


const TEST_URL = process.env.TEST_URL;
fixture('/signin').page(`${TEST_URL}/signin`);


test(`should display the signin form`, async (t) => {

  await t
    .navigateTo(`${TEST_URL}/signin`)
    .expect(Selector('H1').withText('Signin').exists).ok()
    .expect(Selector('form').exists).ok()
    .expect(Selector('input[name="email"]').exists).ok()
    .expect(Selector('input[name="password"]').exists).ok()
    .expect(Selector('input[disabled]').exists).ok()
    .expect(Selector('.validation-list').exists).ok()
    .expect(Selector('.validation-list > .error').nth(0).withText(
      'Email is required.'
    ).exists).ok()
    .expect(Selector('.validation-list > .error').nth(1).withText(
      'Password is required.'
    ).exists).ok();
});


// test(`should validate the password field`, async (t) => {
//   await t
//     .navigateTo(`${TEST_URL}/signin`)
//     .expect(Selector('H1').withText('Signin').exists).ok()
//     .expect(Selector('form').exists).ok()
//     .expect(Selector('input[disabled]').exists).ok()
//     .expect(Selector('.validation-list > .error').nth(2).withText(
//       'Password must be greater than 10 characters.'
//     ).exists).ok()
//     .typeText('input[name="password"]', PASSWORD)
//     .expect(Selector('.validation-list').exists).ok()
//     .expect(Selector('.validation-list > .error').nth(2).withText(
//       'Password must be greater than 10 characters.'
//     ).exists).notOk()
//     .expect(Selector('.validation-list > .success').nth(0).withText(
//       'Password must be greater than 10 characters.'
//     ).exists).ok()
//     .click(Selector('a').withText('Signup'))
//     .expect(Selector('.validation-list > .error').nth(3).withText(
//       'Password must be greater than 10 characters.'
//     ).exists).ok();
// });


test(`should allow a user to signin`, async (t) => {

  const a = Selector('a');

  // signup user
  await t
    .navigateTo(`${TEST_URL}/signup`)
    .typeText('input[name="username"]', USERNAME)
    .typeText('input[name="email"]', EMAIL)
    .typeText('input[name="password"]', PASSWORD)
    .click(Selector('input[type="submit"]'));

  // sign a user out
  await t
    .click(a.withText('Signout'));

  // sign a user in
  await t
    .navigateTo(`${TEST_URL}/signin`)
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
    .expect(a.withText('Profile').exists).ok()
    .expect(a.withText('Signout').exists).ok()
    .expect(a.withText('Signup').exists).notOk()
    .expect(a.withText('Signin').exists).notOk()
    .expect(Selector('.alert-success').withText('Welcome!').exists).ok();

  // sign a user out
  await t
    .click(a.withText('Signout'));

  // assert '/signout' is displayed properly
  await t
    .expect(Selector('p').withText('You are now signed out').exists).ok()
    .expect(a.withText('Profile').exists).notOk()
    .expect(a.withText('Signout').exists).notOk()
    .expect(a.withText('Signup').exists).ok()
    .expect(a.withText('Signin').exists).ok();
});


test(`should throw an error if the credentials are invalid`, async (t) => {

  const a = Selector('a');

  // attempt to signin with invalid email
  await t
    .navigateTo(`${TEST_URL}/signin`)
    .typeText('input[name="email"]', 'invalid@email.com')
    .typeText('input[name="password"]', PASSWORD)
    .click(Selector('input[type="submit"]'));

  // assert user signin failed
  await t
    .expect(Selector('H1').withText('Signin').exists).ok()
    .expect(a.withText('Profile').exists).notOk()
    .expect(a.withText('Signout').exists).notOk()
    .expect(a.withText('Signup').exists).ok()
    .expect(a.withText('Signin').exists).ok()
    .expect(Selector('.alert-success').exists).notOk()
    .expect(Selector('.alert-danger').withText(
      'signin failed.'
    ).exists).ok();

  // attempt to signin with invalid password
  await t
    .navigateTo(`${TEST_URL}/signin`)
    .typeText('input[name="email"]', EMAIL)
    .typeText('input[name="password"]', 'invalidpassword')
    .click(Selector('input[type="submit"]'));

  // assert user signin failed
  await t
    .expect(Selector('H1').withText('Signin').exists).ok()
    .expect(a.withText('Profile').exists).notOk()
    .expect(a.withText('Signout').exists).notOk()
    .expect(a.withText('Signup').exists).ok()
    .expect(a.withText('Signin').exists).ok()
    .expect(Selector('.alert-success').exists).notOk()
    .expect(Selector('.alert-danger').withText(
      'signin failed.'
    ).exists).ok();
});
