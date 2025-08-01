from flask import Blueprint, jsonify
from ..models import db, PlantillaItem, Employee

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/", methods=["GET"])
def dashboard_overview():
    total_items = PlantillaItem.query.count()

    # Group by office
    office_data = db.session.query(
        PlantillaItem.office,
        db.func.count(PlantillaItem.id)
    ).group_by(PlantillaItem.office).all()

    result = {
        "total_items": total_items,
        "by_office": [{"office": office, "count": count} for office, count in office_data]
    }

    print("[API] Returning analytics:", result)
    return jsonify(result)

