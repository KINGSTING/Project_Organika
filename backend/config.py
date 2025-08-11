import os
from dotenv import load_dotenv
import cloudinary

load_dotenv()  # Load environment variables from .env

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

# ✅ Configure Cloudinary globally
cloudinary.config(
    secure=True  # Optional: force https
)
