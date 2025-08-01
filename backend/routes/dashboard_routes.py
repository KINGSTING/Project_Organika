from flask import Blueprint, jsonify
from ..models import db, PlantillaItem, Employee

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/api/dashboard-overview", methods=["GET"])
def dashboard_overview():
    print("[API] /api/dashboard-overview called")

    total_items = PlantillaItem.query.count()

    # Derive filled and vacant based on employee_id
    filled = PlantillaItem.query.filter(PlantillaItem.employee_id.isnot(None)).count()
    vacant = PlantillaItem.query.filter(PlantillaItem.employee_id.is_(None)).count()

    # Frozen, funded, unfunded: no direct data, so we skip or return null
    frozen = None
    funded = None
    unfunded = None

    # Group by office
    office_data = db.session.query(
        PlantillaItem.office,
        db.func.count(PlantillaItem.id)
    ).group_by(PlantillaItem.office).all()

    result = {
        "total_items": total_items,
        "filled": filled,
        "vacant": vacant,
        "frozen": frozen,
        "funded": funded,
        "unfunded": unfunded,
        "by_office": [{"office": office, "count": count} for office, count in office_data]
    }

    print("[API] Returning analytics:", result)
    return jsonify(result)

