import {Selector} from 'testcafe';

const randomstring = require('randomstring');


const USERNAME = randomstring.generate();
const EMAIL = `${USERNAME}@email.com`;
const PASSWORD = 'greaterthanten';

const TEST_URL = process.env.TEST_URL


fixture('/signup').page(`${TEST_URL}/signup`);

test('should display flash messages correctly', async(t) => {

  // signup user
  await t
    .navigateTo(`${TEST_URL}/signup`)
    .typeText('input[name="username"]', USERNAME)
    .typeText('input[name="email"]', EMAIL)
    .typeText('input[name="password"]', PASSWORD)
    .click(Selector('input[type="submit"]'));

  // assert flash messages are removed when user clicks the 'x'
  await t
    .expect(Selector('.alert-success').withText('Welcome!').exists).ok()
    .click(Selector('.alert > button'))
    .expect(Selector('.alert-success').withText('Welcome!').exists).notOk();

  // sign out a user
  await t
    .click(Selector('a').withText('Signout'));

  // attempt to sign in
  await t
    .navigateTo(`${TEST_URL}/signin`)
    .typeText('input[name="email"]', 'invalid@email.com')
    .typeText('input[name="password"]', PASSWORD)
    .click(Selector('input[type="submit"]'));

  // assert correct message is flashed
  await t
    .expect(Selector('.alert-success').exists).notOk()
    .expect(Selector('.alert-danger').withText(
      'signin failed.'
    ).exists).ok();

  // sign a user in
  await t
    .navigateTo(`${TEST_URL}/signin`)
    .typeText('input[name="email"]', EMAIL)
    .typeText('input[name="password"]', PASSWORD)
    .click(Selector('input[type="submit"]'))

  // assert flash message is removed when a new message if flashed
  await t
    .expect(Selector('.alert-success').withText('Welcome!').exists).ok()
    .expect(Selector('.alert-danger').withText(
      'signin failed.'
    ).exists).notOk();

  // sign a user out
  await t
    .click(Selector('a').withText('Signout'));

  // sign a user in
  await t
    .navigateTo(`${TEST_URL}/signin`)
    .typeText('input[name="email"]', EMAIL)
    .typeText('input[name="password"]', PASSWORD)
    .click(Selector('input[type="submit"]'));

  // assert flash message is removed after three seconds
  await t
    .expect(Selector('.alert-success').withText('Welcome!').exists).ok()
    .wait(4000)
    .expect(Selector('.alert-success').withText('Welcome!').exists).notOk();
});
