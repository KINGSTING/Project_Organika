# backend/routes/dashboard_routes.py

from flask import Blueprint, jsonify
from ..models import db, PlantillaItem

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/", methods=["GET"])
def dashboard_overview():
    total_items = PlantillaItem.query.count()

    # Group by office
    office_data = db.session.query(
        PlantillaItem.office,
        db.func.count(PlantillaItem.id)
    ).group_by(PlantillaItem.office).all()

    # Vacancies grouped by salary_grade
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
        "by_office": [
            {"office": office, "count": count}
            for office, count in office_data
        ],
        "vacancy_by_grade": [
            {"salary_grade": grade, "vacancies": vac}
            for grade, vac in vacancy_data
        ],
    }

    print("[API] Returning analytics:", result)
    return jsonify(result)
