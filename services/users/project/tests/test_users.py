# users/project/tests/test_users.py


import datetime
import json

from project import db
from project.tests.base import BaseTestCase
from project.api.utils import add_user


class TestUsersBlueprint(BaseTestCase):
    """ Tests for the users blueprint. """

    def test_get_users_ping(self):
        """ Sanity check. """

        with self.client:
            response = self.client.get(
                '/users/ping'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'success')
            self.assertEqual(
                data['message'],
                'pong!'
            )
            self.assert200(response)

    def test_get_users(self):
        """ Verify GET /users returns users ordered by created_at. """

        created = datetime.datetime.utcnow() + datetime.timedelta(-30)
        user = add_user(self.USERNAME, self.EMAIL, self.PASSWORD, created)
        user2 = add_user(self.USERNAME2, self.EMAIL2, self.PASSWORD)
        with self.client:
            response = self.client.get(
                '/users'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'success')
            self.assertEqual(data['message'], 'Users fetched.')
            self.assertEqual(len(data['data']['users']), 3)
            self.assertEqual(
                data['data']['users'][0]['username'],
                self.admin.username
            )
            self.assertEqual(
                data['data']['users'][0]['email'],
                self.admin.email
            )
            self.assertEqual(
                data['data']['users'][1]['username'],
                user2.username
            )
            self.assertEqual(
                data['data']['users'][1]['email'],
                user2.email
            )
            self.assertEqual(
                data['data']['users'][2]['username'],
                user.username
            )
            self.assertEqual(
                data['data']['users'][2]['email'],
                user.email
            )
            self.assertIn('created_at', data['data']['users'][1])
            self.assertIn('created_at', data['data']['users'][2])
            self.assertEqual(response.content_type, 'application/json')
            self.assert200(response)

    def test_post_users_with_not_admin_user_token(self):
        """ Verify non admins cannot add a new user. """

        user = add_user(self.USERNAME, self.EMAIL, self.PASSWORD)
        with self.client:
            response = self.client.post(
                '/users',
                data=json.dumps({
                    'username': self.USERNAME2,
                    'email': self.EMAIL2,
                    'password': self.PASSWORD
                }),
                content_type='application/json',
                headers={
                    'Authorization': 'Bearer ' + self.get_jwt(user)
                }
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'You do not have permission to do that.'
            )
            self.assert401(response)

    def test_post_users_inactive_admin(self):
        """ Verify not active admins cannot add a new user. """

        self.admin.active = False
        db.session.commit()
        with self.client:
            response = self.client.post(
                '/users',
                data=json.dumps({
                    'username': self.USERNAME2,
                    'email': self.EMAIL2,
                    'password': self.PASSWORD
                }),
                content_type='application/json',
                headers={
                    'Authorization': 'Bearer ' + self.get_jwt(self.admin)
                }
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'Something went wrong. Please contact us.'
            )
            self.assert401(response)

    def test_post_users(self):
        """ Verify POST request to /users adds a new user to the database. """

        with self.client:
            response = self.client.post(
                '/users',
                data=json.dumps({
                    'username': self.USERNAME,
                    'email': self.EMAIL,
                    'password': self.PASSWORD
                }),
                content_type='application/json',
                headers={
                    'Authorization': 'Bearer ' + self.get_jwt(self.admin)
                }
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'success')
            self.assertEqual(
                data['message'],
                '{email} was added!'.format(email=self.EMAIL)
            )
            self.assertEqual(response.content_type, 'application/json')
            self.assertEqual(response.status_code, 201)

    def test_post_users_empty(self):
        """ Verify adding an empty user throws an error. """

        with self.client:
            response = self.client.post(
                '/users',
                data=json.dumps({}),
                content_type='application/json',
                headers={
                    'Authorization': 'Bearer ' + self.get_jwt(self.admin)
                }
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'Invalid payload.'
            )
            self.assertEqual(response.content_type, 'application/json')
            self.assert400(response)

    def test_post_users_no_username(self):
        """ Verify adding a user without a username throws an error. """

        with self.client:
            response = self.client.post(
                '/users',
                data=json.dumps({
                    'email': self.EMAIL,
                    'password': self.PASSWORD
                }),
                content_type='application/json',
                headers={
                    'Authorization': 'Bearer ' + self.get_jwt(self.admin)
                }
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'Invalid payload.'
            )
            self.assertEqual(response.content_type, 'application/json')
            self.assert400(response)

    def test_post_users_no_email(self):
        """ Verify adding a user without an email throws an error. """

        with self.client:
            response = self.client.post(
                '/users',
                data=json.dumps({
                    'username': self.USERNAME,
                    'password': self.PASSWORD
                }),
                content_type='application/json',
                headers={
                    'Authorization': 'Bearer ' + self.get_jwt(self.admin)
                }
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'Invalid payload.'
            )
            self.assertEqual(response.content_type, 'application/json')
            self.assert400(response)

    def test_post_users_no_password(self):
        """ Verify adding a user without a password throws an error. """

        with self.client:
            response = self.client.post(
                '/users',
                data=json.dumps({
                    'username': self.USERNAME,
                    'email': self.EMAIL
                }),
                content_type='application/json',
                headers={
                    'Authorization': 'Bearer ' + self.get_jwt(self.admin)
                }
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'Invalid payload.'
            )
            self.assertEqual(response.content_type, 'application/json')
            self.assert400(response)

    def test_post_users_duplicate_user(self):
        """ Verify adding a duplicate user throws an error. """

        user = add_user(self.USERNAME, self.EMAIL, self.PASSWORD)
        with self.client:
            response = self.client.post(
                '/users',
                data=json.dumps({
                    'username': user.username,
                    'email': user.email,
                    'password': user.password
                }),
                content_type='application/json',
                headers={
                    'Authorization': 'Bearer ' + self.get_jwt(self.admin)
                }
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'User already exists.'
            )
            self.assertEqual(response.content_type, 'application/json')
            self.assert400(response)

    def test_post_users_duplicate_username(self):
        """ Verify adding a user with a duplicate username throws an error. """

        user = add_user(self.USERNAME, self.EMAIL, self.PASSWORD)
        with self.client:
            response = self.client.post(
                '/users',
                data=json.dumps({
                    'username': user.username,
                    'email': self.EMAIL2,
                    'password': self.PASSWORD
                }),
                content_type='application/json',
                headers={
                    'Authorization': 'Bearer ' + self.get_jwt(self.admin)
                }
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'User already exists.'
            )
            self.assertEqual(response.content_type, 'application/json')
            self.assert400(response)

    def test_post_users_duplicate_email(self):
        """ Verify adding a user with a duplicate email throws an error. """

        user = add_user(self.USERNAME, self.EMAIL, self.PASSWORD)
        with self.client:
            response = self.client.post(
                '/users',
                data=json.dumps({
                    'username': self.USERNAME2,
                    'email': user.email,
                    'password': self.PASSWORD
                }),
                content_type='application/json',
                headers={
                    'Authorization': 'Bearer ' + self.get_jwt(self.admin)
                }
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'User already exists.'
            )
            self.assertEqual(response.content_type, 'application/json')
            self.assert400(response)

    def test_get_users_by_id(self):
        """ Verify GET request to /users/{user_id} fetches a user. """

        user = add_user(self.USERNAME, self.EMAIL, self.PASSWORD)
        with self.client:
            response = self.client.get(
                '/users/{user_id}'.format(
                    user_id=user.id
                )
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'success')
            self.assertEqual(
                data['message'],
                'User {user_id} fetched.'.format(user_id=user.id)
            )
            self.assertEqual(data['data']['username'], self.USERNAME)
            self.assertEqual(data['data']['email'], self.EMAIL)
            self.assertIn('created_at', data['data'])
            self.assertEqual(response.content_type, 'application/json')
            self.assert200(response)

    def test_get_users_invalid_id(self):
        """ Verify fetching an id that doesn't exist throws an error. """

        with self.client:
            response = self.client.get(
                '/users/999'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'User does not exist.'
            )
            self.assertEqual(response.content_type, 'application/json')
            self.assert404(response)

    def test_get_users_invalid_id_value(self):
        """ Verify fetching the invalid id 'blah' throws an error. """

        with self.client:
            response = self.client.get(
                '/users/blah'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(data['status'], 'error')
            self.assertEqual(
                data['message'],
                'User does not exist.'
            )
            self.assertEqual(response.content_type, 'application/json')
            self.assert404(response)
