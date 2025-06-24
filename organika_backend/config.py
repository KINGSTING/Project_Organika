import os

class Config:
    SQLALCHEMY_DATABASE_URI = "postgresql://neondb_owner:npg_zFejt23GdDuO@ep-withered-night-a8w2ojls-pooler.eastus2.azure.neon.tech/neondb?sslmode=require"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "secret-key")