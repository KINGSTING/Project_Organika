# backend/routes/dashboard_routes.py

from flask import Blueprint, jsonify
from ..models import db, PlantillaItem, Employee

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/", methods=["GET"])
def dashboard_overview():
    total_items = PlantillaItem.query.count()

    total_employed = PlantillaItem.query.filter(PlantillaItem.employee_id.isnot(None)).count()
    total_elected = (
        db.session.query(Employee).filter(Employee.employment_status == "Elected").count()
    )
    total_permanent = (
        db.session.query(Employee).filter(Employee.employment_status == "Permanent").count()
    )
    total_conterminous = (
        db.session.query(Employee).filter(Employee.employment_status == "Conterminous").count()
    )
    total_temporary = (
        db.session.query(Employee).filter(Employee.employment_status == "Temporary").count()
    )

    office_data = db.session.query(
        PlantillaItem.office,
        db.func.count(PlantillaItem.id)
    ).group_by(PlantillaItem.office).all()

    vacancy_data = (
        db.session.query(
            PlantillaItem.salary_grade,
            db.func.count(PlantillaItem.id).label("vacancies")
        )
        .filter(PlantillaItem.employee_id.is_(None))
        .group_by(PlantillaItem.salary_grade)
        .order_by(PlantillaItem.salary_grade)
        .all()
    )

    # Get Longest Serving
    longest_serving = (
        db.session.query(Employee.full_name, Employee.original_appointment)
        .filter(Employee.original_appointment.isnot(None))
        .order_by(Employee.original_appointment.asc())
        .first()
    )

    # Get Newest Hired Employees (might be more than one with same latest date)
    newest_date_subquery = (
        db.session.query(db.func.max(Employee.original_appointment))
        .scalar()
    )
    newest_hired = (
        db.session.query(Employee.full_name, Employee.original_appointment)
        .filter(Employee.original_appointment == newest_date_subquery)
        .all()
    )

    result = {
        "total_items": total_items,
        "total_employed": total_employed,
        "total_elected": total_elected,
        "total_permanent": total_permanent,
        "total_conterminous": total_conterminous,
        "total_temporary": total_temporary,
        "by_office": [
            {"office": office, "count": count}
            for office, count in office_data
        ],
        "vacancy_by_grade": [
            {"salary_grade": grade, "vacancies": vac}
            for grade, vac in vacancy_data
        ],
        "longest_serving": {
            "full_name": longest_serving.full_name,
            "original_appointment": longest_serving.original_appointment.isoformat()
        } if longest_serving else None,
        "newest_hired": [
            {
                "full_name": emp.full_name,
                "original_appointment": emp.original_appointment.isoformat()
            } for emp in newest_hired
        ] if newest_hired else []
    }

    return jsonify(result)

@dashboard_bp.route("/employees/<status>", methods=["GET"])
def get_employees_by_status(status):
    employees = (
        Employee.query
        .filter(Employee.employment_status.ilike(status))
        .with_entities(Employee.full_name, Employee.position_title)
        .order_by(Employee.full_name)
        .all()
    )

    return jsonify([
        {"full_name": emp.full_name, "position_title": emp.position_title}
        for emp in employees
    ])

