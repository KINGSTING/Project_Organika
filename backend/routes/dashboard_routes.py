# backend/routes/dashboard_routes.py

from flask import Blueprint, jsonify
from ..models import db, PlantillaItem, Employee

dashboard_bp = Blueprint("dashboard", __name__)

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
    }

    return jsonify(result)
