#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, jsonify, make_response
from flask_restful import Resource
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, login_user, login_required, logout_user, current_user

# Local imports
from config import app, db, api
from models import User, Book, TBR, Review

# Initialize extensions
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class UsersResource(Resource):
    def get(self):
        users = User.query.all()
        return make_response(jsonify([user.serialize() for user in users]))

class BooksResource(Resource):
    def get(self):
        books = Book.query.all()
        return make_response(jsonify([book.serialize() for book in books]))

class TBRResource(Resource):
    def get(self):
        tbr_entries = TBR.query.all()
        return make_response(jsonify([{
            'user_id': tbr.user_id,
            'book_id': tbr.book_id,
            'username': tbr.user.username,
            'book_title': tbr.book.title
        } for tbr in tbr_entries]))

class ReviewsResource(Resource):
    def get(self):
        reviews = Review.query.all()
        return make_response(jsonify([{
            'user_id': review.user_id,
            'book_id': review.book_id,
            'rating': review.rating,
            'review_text': review.review_text,
            'username': review.user.username,
            'book_title': review.book.title
        } for review in reviews]))

class SignupResource(Resource):
    def post(self):
        try:
            data = request.get_json()
            print(f"Received data: {data}")

            # Hash the password
            hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
            print(f"Hashed password: {hashed_password}")

            # Create new user
            new_user = User(username=data['username'], email=data['email'], password=hashed_password)
            db.session.add(new_user)
            db.session.commit()
            print(f"User {new_user.username} created and committed to database")

            # Log in the new user
            login_user(new_user)
            print(f"User {new_user.username} logged in")

            # Return success response
            return make_response(jsonify({'message': 'User created and logged in'}), 201)
        
        except Exception as e:
            print(f"Error during signup: {e}")
            return make_response(jsonify({'message': 'Signup failed', 'error': str(e)}), 500)


class LoginResource(Resource):
    def post(self):
        try:
            data = request.get_json()
            print(f"Received login data: {data}")

            user = User.query.filter_by(email=data['email']).first()
            if user and bcrypt.check_password_hash(user.password, data['password']):
                login_user(user)
                print(f"User {user.username} logged in successfully")
                return make_response(jsonify({'message': 'Logged in successfully'}), 200)
            else:
                print(f"Invalid credentials for user: {data['email']}")
                return make_response(jsonify({'message': 'Invalid credentials'}), 401)
        except Exception as e:
            print(f"Error during login: {e}")
            return make_response(jsonify({'message': 'Login failed', 'error': str(e)}), 500)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return make_response(jsonify({'message': 'Logged out successfully'}))

@app.route('/current_user')
def get_current_user():
    if current_user.is_authenticated:
        return make_response(jsonify({'username': current_user.username, 'email': current_user.email}))
    else:
        return make_response(jsonify({'message': 'No user logged in'}), 401)

# Register resources
api.add_resource(UsersResource, '/users')
api.add_resource(BooksResource, '/books')
api.add_resource(TBRResource, '/tbr')
api.add_resource(ReviewsResource, '/reviews')
api.add_resource(SignupResource, '/signup')
api.add_resource(LoginResource, '/login')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
