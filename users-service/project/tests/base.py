# users-service/project/tests/base.py


from flask_testing import TestCase

from project import create_app, db


class BaseTestCase(TestCase):
    """ Sets up the Base Test Case class for tests. """

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
        # TODO try setting up admin here

    def tearDown(self):
        db.session.remove()
        db.drop_all()
