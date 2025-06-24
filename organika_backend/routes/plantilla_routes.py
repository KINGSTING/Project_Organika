from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ..models import  db, PlantillaItem

plantilla_bp = Blueprint("plantilla", __name__)

@plantilla_bp.route("/", methods=["GET"])
@jwt_required()
def get_all_items():
    items = PlantillaItem.query.all()
    return jsonify([{
        "id": i.id,
        "item_code": i.item_code,
        "position_title": i.position_title,
        "salary_grade": i.salary_grade,
        "office": i.office,
        "status": i.status,
        "funding_status": i.funding_status,
        "employee_id": i.employee_id
    } for i in items])

@plantilla_bp.route("/", methods=["POST"])
@jwt_required()
def add_item():
    data = request.json
    item = PlantillaItem(**data)
    db.session.add(item)
    db.session.commit()
    return jsonify({"msg": "Plantilla item added"}), 201

@plantilla_bp.route("/", methods=["POST"])
def submit_test():
    data = request.get_json()
    test_input = data.get("test_input", "")
    print("Received from frontend:", test_input)  # Console log
    return jsonify({"msg": "TEST WAS A SUCCESS"}), 201
