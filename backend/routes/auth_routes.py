from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash, generate_password_hash
from ..models import User, db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    role = data.get("role", "viewer")  # Default to 'viewer'

    if not username or not password:
        return jsonify({"msg": "Username and password are required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Username already exists"}), 409

    new_user = User(
        username=username,
        password_hash=generate_password_hash(password),
        role=role
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User created successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"msg": "Invalid credentials"}), 401

    access_token = create_access_token(identity={"id": user.id, "role": user.role})
    return jsonify(access_token=access_token, role=user.role)

