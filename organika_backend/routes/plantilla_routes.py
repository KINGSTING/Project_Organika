from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ..models import  db, PlantillaItem

plantilla_bp = Blueprint("plantilla", __name__)

@plantilla_bp.route("/", methods=["POST"])
def submit_test():
    data = request.get_json()
    test_input = data.get("test_input", "")
    print("Received from frontend:", test_input)
    return jsonify({"msg": "TEST WAS A SUCCESS"}), 201
