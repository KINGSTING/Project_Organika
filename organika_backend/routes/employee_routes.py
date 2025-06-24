from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ..models import Employee, db

employee_bp = Blueprint("employee", __name__)

@employee_bp.route("/", methods=["GET"])
@jwt_required()
def list_employees():
    employees = Employee.query.all()
    return jsonify([{
        "id": e.id,
        "full_name": e.full_name,
        "position_title": e.position_title
    } for e in employees])

@employee_bp.route("/", methods=["POST"])
@jwt_required()
def add_employee():
    data = request.json
    emp = Employee(**data)
    db.session.add(emp)
    db.session.commit()
    return jsonify({"msg": "Employee added"}), 201
