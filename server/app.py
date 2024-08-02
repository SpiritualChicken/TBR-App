#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, jsonify
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Book, TBR, Review


# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class UsersResource(Resource):
    def get(self):
        users = User.query.all()
        return jsonify([user.serialize() for user in users])

class BooksResource(Resource):
    def get(self):
        books = Book.query.all()
        return jsonify([book.serialize() for book in books])

class TBRResource(Resource):
    def get(self):
        tbr_entries = TBR.query.all()
        return jsonify([{
            'user_id': tbr.user_id,
            'book_id': tbr.book_id,
            'username': tbr.user.username,
            'book_title': tbr.book.title
        } for tbr in tbr_entries])

class ReviewsResource(Resource):
    def get(self):
        reviews = Review.query.all()
        return jsonify([{
            'user_id': review.user_id,
            'book_id': review.book_id,
            'rating': review.rating,
            'review_text': review.review_text,
            'username': review.user.username,
            'book_title': review.book.title
        } for review in reviews])

api.add_resource(UsersResource, '/users')
api.add_resource(BooksResource, '/books')
api.add_resource(TBRResource, '/tbr')
api.add_resource(ReviewsResource, '/reviews')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

