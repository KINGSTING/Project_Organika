import os
from dotenv import load_dotenv
import cloudinary

load_dotenv()  # Load environment variables from .env

class Config:
    # Get DATABASE_URL and replace postgres:// with postgresql:// for SQLAlchemy
    database_url = os.getenv("DATABASE_URL", "")
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)

    SQLALCHEMY_DATABASE_URI = database_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

# ✅ Configure Cloudinary globally
cloudinary.config(
    secure=True  # Optional: force https
)
