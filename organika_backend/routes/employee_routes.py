from flask import Blueprint, request, jsonify
from ..models import Employee, db
from sqlalchemy.exc import IntegrityError

employee_bp = Blueprint("employee", __name__)

@employee_bp.route("/create_employee", methods=["POST"])
def create_employee():
    data = request.get_json()
    try:
        new_item = Employee(
            id=data["item_code"],
            position_title=data["position_title"],
            salary_grade=data["salary_grade"],
            office=data["office"],
            status=data.get("status"),
            funding_status=data["funding_status"],
            employee_id=data.get("employee_id"),
        )
        db.session.add(new_item)
        db.session.commit()
        return jsonify({"msg": "Plantilla item created successfully!"}), 201

    except IntegrityError as e:
        db.session.rollback()
        if "plantilla_items_item_code_key" in str(e.orig):
            return jsonify({"error": "Item code already exists."}), 400
        return jsonify({"error": "Database integrity error."}), 400


@employee_bp.route("/employees", methods=["GET"])
def get_employees():
    from ..models import Employee  # adjust this import if needed
    employees = Employee.query.order_by(Employee.full_name.asc()).all()
    return jsonify([
        {"id": emp.id, "full_name": emp.full_name} for emp in employees
    ])