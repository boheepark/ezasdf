# users-service/project/tests/test_users.py


import json

from project.tests.base import BaseTestCase


class TestUserService(BaseTestCase):

    def test_ping_pong(self):
        with self.client:
            response = self.client.get(
                '/users/ping'
            )
            data = json.loads(response.data.decode())
            self.assertEqua
