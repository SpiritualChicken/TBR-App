#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db
from models import db, User, Book, TBR, Review

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!

 # Clear existing data
        Review.query.delete()
        TBR.query.delete()
        User.query.delete()
        Book.query.delete()
        
        # Create users
        users = []
        for _ in range(10):
            user = User(
                username=fake.user_name(),
                email=fake.email(),
                password=fake.password()
            )
            users.append(user)
            db.session.add(user)
        
        # Create books
        books = []
        for _ in range(20):
            book = Book(
                title=fake.sentence(nb_words=4),
                author=fake.name(),
            )
            books.append(book)
            db.session.add(book)
        
        # Create TBR entries
        for _ in range(30):
            tbr_entry = TBR(
                user=rc(users),
                book=rc(books)
            )
            db.session.add(tbr_entry)
        
        # Create reviews
        for _ in range(30):
            review = Review(
                rating=randint(1, 5),
                review_text=fake.text(max_nb_chars=200),
                user=rc(users),
                book=rc(books)
            )
            db.session.add(review)
        
        db.session.commit()
        print("Seeding complete!")

        # db.session.add_all(users, books, tbr_entry, review)
        # db.session.commit