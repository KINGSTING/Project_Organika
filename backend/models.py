from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy.orm import relationship
from . import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = "users"
    __table_args__ = {'schema': 'public'}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(10), nullable=False)  # 'admin' or 'viewer'

    def __repr__(self):
        return f"<User {self.username}>"

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


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
    GSIS_BP_NR = db.Column(db.Integer, nullable=True)
    TIN_NR = db.Column(db.Integer, nullable=True)

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

class ServiceRecord(db.Model):
    __tablename__ = "service_records"
    __table_args__ = {"schema": "public"}

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey("public.employees.id", ondelete="CASCADE"), nullable=False)

    position_title = db.Column(db.String(100), nullable=True)
    start_date = db.Column(db.Date, nullable=True)
    end_date = db.Column(db.Date, nullable=True)
    office = db.Column(db.String(150), nullable=True)
    remarks = db.Column(db.Text, nullable=True)
    salary_monthly = db.Column(db.Numeric(10, 2), nullable=True)
    status = db.Column(db.String(50), nullable=True)
    separation_date = db.Column(db.Date, nullable=True)
    separation_cause = db.Column(db.String(150), nullable=True)
    leave_without_pay = db.Column(db.Integer, nullable=True)

    employee = relationship("Employee", backref="service_records", lazy="joined")

    def __repr__(self):
        return f"<ServiceRecord {self.position_title} for Employee {self.employee_id}>"