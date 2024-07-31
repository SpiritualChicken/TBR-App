#!/usr/bin/env python3

# Local imports
from app import app
from models import db, User, Book, TBR, Review

if __name__ == '__main__':
    with app.app_context():
        print("Fetching and displaying seeded data...")

        # Fetch and print users
        users = User.query.all()
        print("\nUsers:")
        for user in users:
            print(f"ID: {user.id}, Username: {user.username}, Email: {user.email}")

        # Fetch and print books
        books = Book.query.all()
        print("\nBooks:")
        for book in books:
            print(f"ID: {book.id}, Title: {book.title}, Author: {book.author}")

        # Fetch and print TBR entries
        tbr_entries = TBR.query.all()
        print("\nTBR Entries:")
        for tbr in tbr_entries:
            print(f"User ID: {tbr.user_id}, Book ID: {tbr.book_id}")

        # Fetch and print reviews
        reviews = Review.query.all()
        print("\nReviews:")
        for review in reviews:
            print(f"User ID: {review.user_id}, Book ID: {review.book_id}, Rating: {review.rating}, Review: {review.review_text}")

        print("\nData fetch complete!")