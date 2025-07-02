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
    __table_args__ = {'schema': 'public'}

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    position_title = db.Column(db.String(100))
    appointment_date = db.Column(db.Date)
    employment_status = db.Column(db.String(50))
    eligibility = db.Column(db.String(100))

    plantilla_item = db.relationship(
        "PlantillaItem",
        back_populates="employee",
        uselist=False,
        foreign_keys="PlantillaItem.employee_id"  # Correct way
    )

    def __repr__(self):
        return f"<Employee {self.full_name}>"

class PlantillaItem(db.Model):
    __tablename__ = "plantilla_items"

    id = db.Column(db.Integer, primary_key=True)
    item_code = db.Column(db.String(50), unique=True, nullable=False)
    position_title = db.Column(db.String(100), nullable=False)
    salary_grade = db.Column(db.Integer, nullable=False)
    office = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20))
    funding_status = db.Column(db.String(20), nullable=False)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    employee = db.relationship("Employee", backref="plantilla_items", lazy="joined")

    def __repr__(self):
        return f"<PlantillaItem {self.item_code}>"
