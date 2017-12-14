# users/project/tests/test_auth.py


import json

from flask import current_app

from project import db
from project.api.utils import add_user
from project.tests.base import BaseTestCase


class TestAuthBlueprint(BaseTestCase):
    """ Tests for the auth blueprint. """

    def test_post_signup(self):
        """ Verify a new user can sign up. """

        with self.client:
            response = self.client.post(
                '/auth/signup',
                data=json.dumps({
                    'username': self.USERNAME,
                    'email': self.EMAIL,
                    'password': self.PASSWORD
                }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'success')
            self.assertEqual(
                data['message'],
                '{email} signed up.'.format(email=self.EMAIL)
            )
            self.assertTrue(data['data']['token'])
            self.assertEqual(response.content_type, 'application/json')
            self.assertEqual(response.status_code, 201)

    def test_post_signup_empty_user(self):
        """ Verify an empty user cannot sign up. """

        with self.client:
            response = self.client.post(
                '/auth/signup',
                data=json.dumps({}),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'Invalid payload.'
            )
            self.assertEqual(response.content_type, 'application/json')
            self.assert400(response)

    def test_post_signup_no_username(self):
        """ Verify a username is required for signing up. """

        with self.client:
            response = self.client.post(
                '/auth/signup',
                data=json.dumps({
                    'email': self.EMAIL,
                    'password': self.PASSWORD
                }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'Invalid payload.'
            )
            self.assertEqual(response.content_type, 'application/json')
            self.assert400(response)

    def test_post_signup_no_email(self):
        """ Verify an email is required for signing up. """

        with self.client:
            response = self.client.post(
                '/auth/signup',
                data=json.dumps({
                    'username': self.USERNAME,
                    'password': self.PASSWORD
                }),
                content_type='application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'Invalid payload.'
            )
            self.assertEqual(response.content_type, 'application/json')
            self.assert400(response)

    def test_post_signup_no_password(self):
        """ Verify a password is required for signing up. """

        with self.client:
            response = self.client.post(
                '/auth/signup',
                data=json.dumps({
                    'username': self.USERNAME,
                    'email': self.EMAIL
                }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'Invalid payload.'
            )
            self.assertEqual(response.content_type, 'application/json')
            self.assert400(response)

    def test_post_signup_duplicate_username(self):
        """ Verify users cannot signup with duplicate username. """

        with self.client:
            self.client.post(
                '/auth/signup',
                data=json.dumps({
                    'username': self.USERNAME,
                    'email': self.EMAIL,
                    'password': self.PASSWORD
                }),
                content_type='application/json'
            )
            response = self.client.post(
                '/auth/signup',
                data=json.dumps({
                    'username': self.USERNAME,
                    'email': self.EMAIL2,
                    'password': self.PASSWORD
                }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'User already exists.'
            )
            self.assertEqual(response.content_type, 'application/json')
            self.assert400(response)

    def test_post_signup_duplicate_email(self):
        """ Verify users cannot signup with a duplicate email. """

        with self.client:
            self.client.post(
                '/auth/signup',
                data=json.dumps({
                    'username': self.USERNAME,
                    'email': self.EMAIL,
                    'password': self.PASSWORD
                }),
                content_type='application/json'
            )
            response = self.client.post(
                '/auth/signup',
                data=json.dumps({
                    'username': self.USERNAME2,
                    'email': self.EMAIL,
                    'password': self.PASSWORD
                }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'User already exists.'
            )
            self.assertEqual(response.content_type, 'application/json')
            self.assert400(response)

    def test_post_signin_registered_user(self):
        """ Verify registered users can signin. """

        with self.client:
            self.client.post(
                '/auth/signup',
                data=json.dumps({
                    'username': self.USERNAME,
                    'email': self.EMAIL,
                    'password': self.PASSWORD
                }),
                content_type='application/json'
            )
            response = self.client.post(
                '/auth/signin',
                data=json.dumps({
                    'email': self.EMAIL,
                    'password': self.PASSWORD
                }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'success')
            self.assertEqual(
                data['message'],
                '{email} signed in.'.format(email=self.EMAIL)
            )
            self.assertTrue(data['data']['token'])
            self.assertEqual(response.content_type, 'application/json')
            self.assert200(response)

    def test_post_signin_empty(self):
        """ Verify an empty form throws an error. """

        with self.client:
            response = self.client.post(
                '/auth/signin',
                data=json.dumps({}),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'Invalid payload.'
            )
            self.assert400(response)

    def test_post_signin_not_registered_user(self):
        """ Verify not registered users cannot signin. """

        with self.client:
            response = self.client.post(
                '/auth/signin',
                data=json.dumps({
                    'email': self.EMAIL,
                    'password': self.PASSWORD
                }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'User does not exist.'
            )
            self.assertEqual(response.content_type, 'application/json')
            self.assert404(response)

    def test_get_signout(self):
        """ Verify users can sign out. """

        user = add_user(self.USERNAME, self.EMAIL, self.PASSWORD)
        with self.client:
            response = self.client.get(
                '/auth/signout',
                headers={
                    'Authorization': 'Bearer ' + self.get_jwt(user)
                }
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'success')
            self.assertEqual(
                data['message'],
                '{email} signed out.'.format(email=user.email)
            )
            self.assert200(response)

    def test_get_signout_no_token(self):
        """ Verify signing out without a token throws an error. """

        with self.client:
            response = self.client.get(
                '/auth/signout',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'No token provided.'
            )
            self.assert403(response)

    def test_get_signout_invalid_token(self):
        """ Verify signing out with an invalid token throws an error. """

        with self.client:
            response = self.client.get(
                '/auth/signout',
                headers={
                    'Authorization': 'Bearer invalid'
                }
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'Invalid token. Signin again.'
            )
            self.assertEqual(response.content_type, 'application/json')
            self.assert401(response)

    def test_get_signout_expired_token(self):
        """ Verify signing out with an expired token throws an error. """

        current_app.config['TOKEN_EXPIRATION_SECONDS'] = -1
        user = add_user(self.USERNAME, self.EMAIL, self.PASSWORD)
        with self.client:
            response = self.client.get(
                '/auth/signout',
                headers={
                    'Authorization': 'Bearer ' + self.get_jwt(user)
                }
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'Signature expired. Signin again.'
            )
            self.assert401(response)

    def test_get_signout_inactive_user(self):
        """ Verify signing out an inactive user throws an error. """

        user = add_user(self.USERNAME, self.EMAIL, self.PASSWORD)
        user.active = False
        db.session.commit()
        with self.client:
            response = self.client.get(
                '/auth/signout',
                headers={
                    'Authorization': 'Bearer ' + self.get_jwt(user)
                }
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'Something went wrong. Please contact us.'
            )
            self.assert401(response)

    def test_get_profile(self):
        """ Verify user can get profile with valid token. """

        user = add_user(self.USERNAME, self.EMAIL, self.PASSWORD)
        with self.client:
            response = self.client.get(
                '/auth/profile',
                headers={
                    'Authorization': 'Bearer ' + self.get_jwt(user)
                }
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'success')
            self.assertEqual(
                data['message'],
                "Fetched {email}'s profile data.".format(email=user.email)
            )
            self.assertEqual(data['data']['username'], user.username)
            self.assertEqual(data['data']['email'], user.email)
            self.assertTrue(data['data']['active'])
            self.assertTrue(data['data']['created_at'])
            self.assert200(response)

    def test_get_profile_no_token(self):
        """ Verify user cannot get profile without a token. """

        with self.client:
            response = self.client.get(
                '/auth/profile',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'No token provided.'
            )
            self.assert403(response)

    def test_get_profile_invalid_token(self):
        """ Verify user cannot get profile with an invalid token. """

        with self.client:
            response = self.client.get(
                '/auth/profile',
                headers={
                    'Authorization': 'Bearer invalid'
                }
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'Invalid token. Signin again.'
            )
            self.assertEqual(response.content_type, 'application/json')
            self.assert401(response)

    def test_get_profile_expired_token(self):
        """ Verify user cannot get profile with an expired token. """

        current_app.config['TOKEN_EXPIRATION_SECONDS'] = -1
        user = add_user(self.USERNAME, self.EMAIL, self.PASSWORD)
        with self.client:
            response = self.client.get(
                '/auth/signout',
                headers={
                    'Authorization': 'Bearer ' + self.get_jwt(user)
                }
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'Signature expired. Signin again.'
            )
            self.assert401(response)

    def test_get_profile_inactive_user(self):
        """ Verify an inactive user cannot get profile. """

        user = add_user(self.USERNAME, self.EMAIL, self.PASSWORD)
        user.active = False
        db.session.commit()
        with self.client:
            response = self.client.get(
                '/auth/profile',
                headers={
                    'Authorization': 'Bearer ' + self.get_jwt(user)
                }
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'Something went wrong. Please contact us.'
            )
            self.assert401(response)
