# users/project/tests/base.py


import json

from flask_testing import TestCase

from project import create_app, db
from project.api.utils import add_user


class BaseTestCase(TestCase):
    """ Sets up the Base Test Case class for tests. """

    USERNAME = 'test'
    USERNAME2 = 'test2'
    EMAIL = 'test@email.com'
    EMAIL2 = 'test2@email.com'
    PASSWORD = 'password'

    def create_app(self):
        """ Sets up app for testing configurations.

        :return: Flask app
        """

        app = create_app()
        app.config.from_object('project.config.TestingConfig')
        return app

    def setUp(self):
        db.create_all()
        db.session.commit()

        self.admin = add_user('admin', 'admin@email.com', 'password')
        self.admin.admin = True
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def get_jwt(self, user):
        """ Calculates the given user's token.

        :param user:
        :return: str
        """

        response = self.client.post(
            '/auth/signin',
            data=json.dumps({
                'email': user.email,
                'password': 'password'
            }),
            content_type='application/json'
        )
        return json.loads(
            response.data.decode()
        )['data']['token']
