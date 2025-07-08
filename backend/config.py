from dotenv import load_dotenv
import os
import cloudinary
import cloudinary.uploader

load_dotenv()  # Load .env variables

class Config:
    SQLALCHEMY_DATABASE_URI = "postgresql://neondb_owner:npg_zFejt23GdDuO@ep-withered-night-a8w2ojls-pooler.eastus2.azure.neon.tech/project_organika_db?sslmode=require"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = "your_jwt_secret_here"
    cloudinary.config(
        cloudinary_url=os.getenv("CLOUDINARY_URL")
    )



