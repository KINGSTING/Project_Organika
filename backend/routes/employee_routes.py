from flask import Blueprint, request, jsonify
from ..models import Employee, db
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from backend.models import ServiceRecord

employee_bp = Blueprint("employee", __name__)

@employee_bp.route("/create_employee", methods=["POST"])
def create_employee():
    data = request.get_json()
    try:
        new_employee = Employee(
            full_name=data["full_name"],
            position_title=data["position_title"],
            employment_status=data["employment_status"],
            eligibility=data["eligibility"],
            photo_url=data.get("photo_url"),
            emblem_url=data.get("emblem_url"),
            office=data["office"],
        )
        db.session.add(new_employee)
        db.session.commit()
        return jsonify({"msg": "Employee created successfully!"}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Database integrity error."}), 400

@employee_bp.route("/get_employee", methods=["GET"])
def get_employees():
    employees = Employee.query.order_by(Employee.full_name.asc()).all()
    return jsonify([
        {
            "id": emp.id,
            "full_name": emp.full_name,
            "photo_url": emp.photo_url,
            "emblem_url": emp.emblem_url,
            "position_title": emp.position_title,
            "employment_status": emp.employment_status,
            "eligibility": emp.eligibility,
            "office": emp.office,
        }
        for emp in employees
    ])


@employee_bp.route("/update_employee/<int:emp_id>", methods=["PUT"])
def update_employee(emp_id):
    data = request.get_json()

    employee = Employee.query.get(emp_id)
    if not employee:
        return jsonify({"error": "Employee not found"}), 404

    try:
        employee.full_name = data.get("full_name", employee.full_name)
        employee.position_title = data.get("position_title", employee.position_title)
        employee.employment_status = data.get("employment_status", employee.employment_status)
        employee.eligibility = data.get("eligibility", employee.eligibility)
        employee.photo_url = data.get("photo_url", employee.photo_url)
        employee.emblem_url = data.get("emblem_url", employee.emblem_url)
        employee.office = data.get("office", employee.office)

        db.session.commit()
        return jsonify({"msg": "Employee updated successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Update failed", "details": str(e)}), 500


@employee_bp.route("/delete_employee", methods=["DELETE"])
def delete_employee():
    data = request.get_json()
    emp_id = data.get("id")

    if not emp_id:
        return jsonify({"error": "Employee ID is required"}), 400

    employee = Employee.query.get(emp_id)
    if not employee:
        return jsonify({"error": "Employee not found"}), 404

    try:
        db.session.delete(employee)
        db.session.commit()
        return jsonify({"msg": "Employee deleted successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete employee", "details": str(e)}), 500

@employee_bp.route("/service_records", methods=["GET"])
def get_service_records():
    employee_id = request.args.get("employee_id")

    if not employee_id:
        return jsonify({"error": "Missing employee_id"}), 400

    try:
        records = ServiceRecord.query.filter_by(employee_id=employee_id).order_by(ServiceRecord.start_date.desc()).all()
        result = [{
            "id": r.id,
            "start_date": r.start_date.isoformat() if r.start_date else None,
            "end_date": r.end_date.isoformat() if r.end_date else None,
            "position_title": r.position_title,
            "status": r.status,
            "salary_monthly": float(r.salary_monthly) if r.salary_monthly else None,
            "office": r.office,
            "leave_without_pay": r.leave_without_pay,
            "separation_date": r.separation_date.isoformat() if r.separation_date else None,
            "separation_cause": r.separation_cause,
            "remarks": r.remarks
        } for r in records]

        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500