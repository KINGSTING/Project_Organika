from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from . import db

class User(db.Model):
    __tablename__ = "users"
    __table_args__ = {'schema': 'public'}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(10), nullable=False)  # 'admin' or 'viewer'

    def __repr__(self):
        return f"<User {self.username}>"


class Employee(db.Model):
    __tablename__ = "employees"
    __table_args__ = {'schema': 'public'}  # No CHECK constraint here

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(150), nullable=False)
    position_title = db.Column(db.String(100), nullable=True)

    # New fields
    date_of_birth = db.Column(db.Date, nullable=True)
    original_appointment_date = db.Column(db.Date, nullable=True)
    last_promotion_date = db.Column(db.Date, nullable=True)

    employment_status = db.Column(db.String(20), nullable=True)  # No DB constraint
    eligibility = db.Column(db.String(100), nullable=True)
    photo_url = db.Column(db.String, nullable=True)
    emblem_url = db.Column(db.String, nullable=True)
    office = db.Column(db.String(100), nullable=True)

    # One-to-one relationship
    plantilla_item = db.relationship(
        "PlantillaItem",
        back_populates="employee",
        uselist=False
    )

    def __repr__(self):
        return f"<Employee {self.full_name}>"

class PlantillaItem(db.Model):
    __tablename__ = "plantilla_items"
    __table_args__ = {"schema": "public"}  # Make sure it's in 'public'

    id = db.Column(db.Integer, primary_key=True)
    item_code = db.Column(db.String(50), unique=True, nullable=False)
    position_title = db.Column(db.String(100), nullable=False)
    salary_grade = db.Column(db.Integer, nullable=False)
    office = db.Column(db.String(100), nullable=False)
    step = db.Column(db.Integer, nullable=False)
    annual_salary_authorized = db.Column(db.Numeric(12, 2), nullable=False)
    annual_salary_actual = db.Column(db.Numeric(12, 2), nullable=False)
    employee_id = db.Column(db.Integer, db.ForeignKey('public.employees.id', ondelete='SET NULL'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    employee = db.relationship("Employee", back_populates="plantilla_item", lazy="joined")