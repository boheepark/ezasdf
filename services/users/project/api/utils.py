# users/project/api/utils.py


import datetime
from functools import wraps

from flask import request, jsonify

from project import db
from project.api.models import User


def success_response(message, data=None):
    """ Generates a flask success response with jsonify.

    :param message:
    :param data:
    :return: flask response
    """

    return jsonify({
        'status': 'success',
        'message': message,
        'data': data
    })


def error_response(message='Invalid payload.'):
    """ Generates a flask error response with jsonify.

    :param message:
    :return: flask response
    """

    return jsonify({
        'status': 'error',
        'message': message
    })


def add_user(username, email, password, created_at=datetime.datetime.utcnow()):
    """ Adds a new user to the database.

    :param username:
    :param email:
    :param password:
    :param created_at:
    :return: User object
    """

    new_user = User(
        username=username,
        email=email,
        password=password,
        created_at=created_at
    )
    db.session.add(new_user)
    db.session.commit()
    return new_user


def authenticate(f):
    """ Decorator
    Throws a flask error response or calculates
    the id by decoding the token in the header
    and passes the id to function f as a parameter.

    :param f:
    :return: decorated_function
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        """ Wrapper

        :param args:
        :param kwargs:
        :return: flask response | function
        """

        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return error_response(
                'No token provided.'
            ), 403
        token = auth_header[7:]
        user_id = User.decode_jwt(token)
        if isinstance(user_id, str):
            return error_response(
                user_id
            ), 401
        user = User.query.filter_by(id=user_id).first()
        if not user or not user.active:
            return error_response(
                'Something went wrong. Please contact us.'
            ), 401
        return f(user_id, *args, **kwargs)

    return decorated_function
