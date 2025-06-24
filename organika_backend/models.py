from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(10), nullable=False)  # 'admin' or 'viewer'

class Employee(db.Model):
    __tablename__ = "employees"

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    position_title = db.Column(db.String(100))
    appointment_date = db.Column(db.Date)
    employment_status = db.Column(db.String(50))
    eligibility = db.Column(db.String(100))

    plantilla_item = db.relationship("PlantillaItem", back_populates="employee", uselist=False)

class PlantillaItem(db.Model):
    __tablename__ = "plantilla_items"

    id = db.Column(db.Integer, primary_key=True)
    item_code = db.Column(db.String(50), unique=True, nullable=False)
    position_title = db.Column(db.String(100), nullable=False)
    salary_grade = db.Column(db.Integer, nullable=False)
    office = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), nullable=False)
    funding_status = db.Column(db.String(20), nullable=False)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    employee = db.relationship("Employee", back_populates="plantilla_item")
