from flask import Blueprint, request, jsonify
from .. import db
from ..models import PlantillaItem
from sqlalchemy.orm import joinedload
from sqlalchemy.exc import IntegrityError

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


@plantilla_bp.route("/plantilla", methods=["GET"])
def get_plantilla_items():
    items = PlantillaItem.query.options(joinedload(PlantillaItem.employee)).order_by(PlantillaItem.id.desc()).all()
    return jsonify([{
        "id": item.id,
        "item_code": item.item_code,
        "position_title": item.position_title,
        "salary_grade": item.salary_grade,
        "office": item.office,
        "status": item.status,
        "funding_status": item.funding_status,
        "employee_id": item.employee_id,
        "employee_name": item.employee.full_name if item.employee else None,
        "created_at": item.created_at.isoformat()
    } for item in items])

@plantilla_bp.route("/update_plantilla_item/<int:item_id>", methods=["PUT"])
def update_plantilla_item(item_id):
    data = request.get_json()
    item = PlantillaItem.query.get(item_id)

    if not item:
        return jsonify({"error": "Plantilla item not found"}), 404

    try:
        item.item_code = data["item_code"]
        item.position_title = data["position_title"]
        item.salary_grade = data["salary_grade"]
        item.office = data["office"]
        item.status = data["status"]
        item.funding_status = data["funding_status"]
        item.employee_id = data.get("employee_id")

        db.session.commit()
        return jsonify({"msg": "Plantilla item updated successfully!"}), 200

    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Duplicate item code or other integrity error"}), 400

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@plantilla_bp.route("/delete_plantilla_item/<int:item_id>", methods=["DELETE"])
def delete_plantilla_item(item_id):
    item = PlantillaItem.query.get(item_id)

    if not item:
        return jsonify({"error": "Plantilla item not found"}), 404

    try:
        db.session.delete(item)
        db.session.commit()
        return jsonify({"msg": "Plantilla item deleted successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete plantilla item"}), 500

