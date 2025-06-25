from flask import Blueprint, request, jsonify
from .. import db
from ..models import PlantillaItem

plantilla_bp = Blueprint("plantilla", __name__)

@plantilla_bp.route("/create_plantilla_item", methods=["POST"])
def create_plantilla_item():
    data = request.get_json()
    try:
        new_item = PlantillaItem(
            item_code=data["item_code"],
            position_title=data["position_title"],
            salary_grade=data["salary_grade"],
            office=data["office"],
            status=data.get("status", "Vacant"),
            funding_status=data["funding_status"],
            employee_id=data.get("employee_id")
        )
        db.session.add(new_item)
        db.session.commit()
        return jsonify({"msg": "Plantilla item added successfully"}), 201
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 400

@plantilla_bp.route("/", methods=["GET"])
def get_plantilla_items():
    items = PlantillaItem.query.order_by(PlantillaItem.id.desc()).all()
    return jsonify([{
        "id": item.id,
        "item_code": item.item_code,
        "position_title": item.position_title,
        "salary_grade": item.salary_grade,
        "office": item.office,
        "status": item.status,
        "funding_status": item.funding_status,
        "employee_id": item.employee_id,
        "created_at": item.created_at.isoformat()
    } for item in items])
