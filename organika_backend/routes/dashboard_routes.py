from flask import Blueprint, jsonify
from ..models import db, PlantillaItem

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/api/dashboard-overview", methods=["GET"])
def dashboard_overview():
    print("[API] /api/dashboard-overview called")

    total_items = PlantillaItem.query.count()
    filled = PlantillaItem.query.filter(PlantillaItem.status == "filled").count()
    vacant = PlantillaItem.query.filter(PlantillaItem.status == "vacant").count()
    frozen = PlantillaItem.query.filter(PlantillaItem.status == "frozen").count()
    funded = PlantillaItem.query.filter(PlantillaItem.funding_status == "funded").count()
    unfunded = PlantillaItem.query.filter(PlantillaItem.funding_status == "unfunded").count()

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
