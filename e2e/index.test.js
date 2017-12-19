import {Selector} from 'testcafe';

const TEST_URL = process.env.TEST_URL;


fixture('/').page(`${TEST_URL}/`);

test(`should display the page correctly if a user is not signed in`, async (t) => {
  await t
    .navigateTo(TEST_URL)
    .expect(Selector('H1').withText('All Users').exists).ok()
    .expect(Selector('a').withText('Profile').exists).notOk()
    .expect(Selector('a').withText('Signout').exists).notOk()
    .expect(Selector('a').withText('Signup').exists).ok()
    .expect(Selector('a').withText('Signin').exists).ok()
    .expect(Selector('.alert').exists).notOk();
});
