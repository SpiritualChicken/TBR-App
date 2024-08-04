#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, jsonify
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

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

@app.route('/users', methods=['GET', 'POST'])
def all_users():
    if request.method == 'GET':
        users = User.query.all()
        user_list = [u.serialize() for u in users]
        return make_response(jsonify(user_list), 200)
    elif request.method == 'POST':
        data = request.get_json()
        user = User(
            username=data['username'],
            email=data['email'],
            password=bcrypt.generate_password_hash(data['password']).decode('utf-8')
        )
        db.session.add(user)
        db.session.commit()
        return make_response(user.serialize(), 201)

@app.route('/users/<int:id>', methods=['GET', 'PATCH', 'DELETE'])
def user_by_id(id):
    user = User.query.filter(User.id == id).first()
    if not user:
        return make_response({"message": "No user found!"}, 404)

    if request.method == 'GET':
        return make_response(user.serialize(), 200)
    elif request.method == 'PATCH':
        data = request.get_json()
        for key, value in data.items():
            setattr(user, key, value)
        db.session.add(user)
        db.session.commit()
        return make_response(user.serialize(), 200)
    elif request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()
        return make_response({'message': f"Successfully deleted user with id of {user.id}"}, 200)

@app.route("/users/<int:id>/tbr", methods=['GET', 'POST'])
def user_tbr_by_id(id):
    user = User.query.filter(User.id == id).first()
    if not user:
        return make_response({"message": "No user found!"}, 404)

    if request.method == 'GET':
        tbr_books = [t.serialize() for t in user.tbr_books]
        return make_response(jsonify(tbr_books), 200)
    elif request.method == 'POST':
        data = request.get_json()
        tbr = TBR(
            user_id=id,
            book_id=data['book_id']
        )
        db.session.add(tbr)
        db.session.commit()
        return make_response(tbr.serialize(), 201)
    
@app.route("/users/<int:user_id>/tbr/<int:tbr_id>", methods=['DELETE'])
def remove_from_tbr(user_id, tbr_id):
    tbr = TBR.query.filter_by(id=tbr_id, user_id=user_id).first()
    if not tbr:
        return make_response({"message": "No TBR entry found!"}, 404)
    db.session.delete(tbr)
    db.session.commit()
    return make_response({"message": "TBR entry deleted successfully!"}, 200)

@app.route("/users/<int:id>/reviews", methods=['GET', 'POST'])
def user_reviews_by_id(id):
    user = User.query.filter(User.id == id).first()
    if not user:
        return make_response({"message": "No user found!"}, 404)

    if request.method == 'GET':
        reviews = [r.serialize() for r in user.reviews]
        return make_response(jsonify(reviews), 200)
    elif request.method == 'POST':
        data = request.get_json()
        review = Review(
            user_id=id,
            book_id=data['book_id'],
            rating=data['rating'],
            review_text=data.get('review_text', '')
        )
        db.session.add(review)
        db.session.commit()
        return make_response(review.serialize(), 201)


@app.route('/books', methods=['GET', 'POST'])
def all_books():
    if request.method == 'GET':
        books = Book.query.all()
        book_list = [b.serialize() for b in books]
        return make_response(jsonify(book_list), 200)
    elif request.method == 'POST':
        data = request.get_json()
        new_book = Book(
            title=data['title'],
            author=data['author']
        )
        db.session.add(new_book)
        db.session.commit()
        return make_response(new_book.serialize(), 201)

@app.route('/reviews', methods=['GET'])
def all_reviews():
    reviews = Review.query.all()
    review_list = [r.serialize() for r in reviews]
    return make_response(jsonify(review_list), 200)

@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        new_user = User(username=data['username'], email=data['email'], password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user)
        return make_response(new_user.serialize(), 201)
    except Exception as e:
        return make_response({'message': 'Signup failed', 'error': str(e)}, 500)

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()
        if user and bcrypt.check_password_hash(user.password, data['password']):
            login_user(user)
            return make_response({'message': 'Logged in successfully', 'user': user.serialize()}, 200)
        else:
            return make_response({'message': 'Invalid credentials'}, 401)
    except Exception as e:
        return make_response({'message': 'Login failed', 'error': str(e)}, 500)

@app.route('/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    return make_response({'message': 'Logged out successfully'}, 200)

@app.route('/current_user', methods=['GET'])
def get_current_user():
    if current_user.is_authenticated:
        return make_response(current_user.serialize(), 200)
    else:
        return make_response({'message': 'No user logged in'}, 401)

if __name__ == '__main__':
    app.run(port=5555, debug=True)
