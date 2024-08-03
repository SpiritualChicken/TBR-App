from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)

    tbr_books = db.relationship('TBR', back_populates='user', cascade='all, delete-orphan')
    reviews = db.relationship('Review', back_populates='user', cascade='all, delete-orphan')

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }
    
    @property
    def is_active(self):
        return True

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)

class Book(db.Model, SerializerMixin):
    __tablename__ = 'books'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    author = db.Column(db.String, nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
        }
    
    tbr_users = db.relationship('TBR', back_populates='book', cascade='all, delete-orphan')
    reviews = db.relationship('Review', back_populates='book', cascade='all, delete-orphan')

class TBR(db.Model, SerializerMixin):
    __tablename__ = 'tbr'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    
    user = db.relationship('User', back_populates='tbr_books')
    book = db.relationship('Book', back_populates='tbr_users')

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'book_id': self.book_id,
            'username': self.user.username,
            'book_title': self.book.title
        }

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Float, nullable=False)
    review_text = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'rating': self.rating,
            'review_text': self.review_text,
            'user_id': self.user_id,
            'book_id': self.book_id,
            'username': self.user.username,
            'book_title': self.book.title
        }
    
    user = db.relationship('User', back_populates='reviews')
    book = db.relationship('Book', back_populates='reviews')