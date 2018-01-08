import {Selector} from 'testcafe';
import randomstring from 'randomstring';
// const randomstring = require('randomstring');


const USERNAME = randomstring.generate();
const EMAIL = `${USERNAME}@email.com`;
const PASSWORD = 'greaterthanten';


const TEST_URL = process.env.TEST_URL;
fixture('/profile').page(`${TEST_URL}/profile`);


test(`Should not display profile if the user is not signed in.`, async (t) => {
  await t
    .navigateTo(`${TEST_URL}/profile`)
    .expect(Selector('p').withText(
      'You must be signed in to view this page.'
    ).exists).ok()
    .expect(Selector('a').withText('Profile').exists).notOk()
    .expect(Selector('a').withText('Signout').exists).notOk()
    .expect(Selector('a').withText('Signup').exists).ok()
    .expect(Selector('a').withText('Signin').exists).ok();
});


test(`Should display profile if the user is signed in.`, async (t) => {

  // signup user
  await t
    .navigateTo(`${TEST_URL}/signup`)
    .typeText('input[name="username"]', USERNAME)
    .typeText('input[name="email"]', EMAIL)
    .typeText('input[name="password"]', PASSWORD)
    .click(Selector('input[type="submit"]'));

  // assert '/profile' is displayed properly
  await t
    .navigateTo(`${TEST_URL}/profile`)
    .expect(Selector('li > strong').withText('User ID:').exists).ok()
    .expect(Selector('li > strong').withText('Email:').exists).ok()
    .expect(Selector('li').withText(EMAIL).exists).ok()
    .expect(Selector('li > strong').withText('Username:').exists).ok()
    .expect(Selector('li').withText(USERNAME).exists).ok()
    .expect(Selector('a').withText('Profile').exists).ok()
    .expect(Selector('a').withText('Signout').exists).ok()
    .expect(Selector('a').withText('Signup').exists).notOk()
    .expect(Selector('a').withText('Signin').exists).notOk();

});
