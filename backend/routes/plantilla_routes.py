from flask import Blueprint, request, jsonify
from .. import db
from ..models import PlantillaItem, Employee
from sqlalchemy.orm import joinedload
from sqlalchemy.exc import IntegrityError
from datetime import datetime

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
            step=data["step"],
            annual_salary_authorized=data["annual_salary_authorized"],
            annual_salary_actual=data["annual_salary_actual"],
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
    items = PlantillaItem.query.order_by(PlantillaItem.id.desc()).all()

    # Fetch all employees as a dict for fast lookup by item_code
    employees = {e.item_code: e.full_name for e in Employee.query.all()}

    return jsonify([{
        "id": item.id,
        "item_code": item.item_code,
        "position_title": item.position_title,
        "salary_grade": item.salary_grade,
        "step": item.step,
        "office": item.office,
        "annual_salary_authorized": str(item.annual_salary_authorized),
        "annual_salary_actual": str(item.annual_salary_actual),
        "employee_name": employees.get(item.item_code),
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
        item.step = data["step"]
        item.office = data["office"]
        item.annual_salary_authorized = data["annual_salary_authorized"]
        item.annual_salary_actual = data["annual_salary_actual"]

        db.session.commit()
        return jsonify({"msg": "Plantilla item updated successfully!"}), 200

    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Duplicate item code or integrity error."}), 400

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
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Failed to delete plantilla item"}), 500
