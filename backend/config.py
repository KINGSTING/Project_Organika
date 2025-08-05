from dotenv import load_dotenv
import os
import cloudinary

load_dotenv()  # Load environment variables from .env

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    # Configure Cloudinary using CLOUDINARY_URL from .env
    cloudinary.config(
        cloudinary_url=os.getenv("CLOUDINARY_URL")
    )
