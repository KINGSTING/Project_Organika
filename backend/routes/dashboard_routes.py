from flask import Blueprint, jsonify
from ..models import db, PlantillaItem, Employee
from datetime import datetime, timedelta

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/", methods=["GET"])
def dashboard_overview():
    total_items = PlantillaItem.query.count()

    total_employed = PlantillaItem.query.filter(PlantillaItem.employee_id.isnot(None)).count()
    total_elected = Employee.query.filter(Employee.employment_status == "Elected").count()
    total_permanent = Employee.query.filter(Employee.employment_status == "Permanent").count()
    total_conterminous = Employee.query.filter(Employee.employment_status == "Conterminous").count()
    total_temporary = Employee.query.filter(Employee.employment_status == "Temporary").count()

    office_data = db.session.query(
        PlantillaItem.office,
        db.func.count(PlantillaItem.id)
    ).group_by(PlantillaItem.office).all()

    vacancy_data = db.session.query(
        PlantillaItem.salary_grade,
        db.func.count(PlantillaItem.id).label("vacancies")
    ).filter(PlantillaItem.employee_id.is_(None)) \
     .group_by(PlantillaItem.salary_grade) \
     .order_by(PlantillaItem.salary_grade).all()

    # Longest Serving Employee
    longest_serving = Employee.query \
        .filter(Employee.original_appointment_date.isnot(None)) \
        .order_by(Employee.original_appointment_date.asc()) \
        .first()

    # Newest Hired Employees (more than one can share the latest date)
    newest_date = db.session.query(
        db.func.max(Employee.original_appointment_date)
    ).scalar()

    newest_hired = []
    if newest_date:
        newest_hired = Employee.query \
            .filter(Employee.original_appointment_date == newest_date) \
            .order_by(Employee.full_name).all()

    result = {
        "total_items": total_items,
        "total_employed": total_employed,
        "total_elected": total_elected,
        "total_permanent": total_permanent,
        "total_conterminous": total_conterminous,
        "total_temporary": total_temporary,
        "by_office": [{"office": office, "count": count} for office, count in office_data],
        "vacancy_by_grade": [{"salary_grade": grade, "vacancies": vac} for grade, vac in vacancy_data],
        "longest_serving": {
            "full_name": longest_serving.full_name,
            "original_appointment": longest_serving.original_appointment_date.isoformat()
        } if longest_serving else None,
        "newest_hired": [
            {
                "full_name": emp.full_name,
                "original_appointment": emp.original_appointment_date.isoformat()
            } for emp in newest_hired
        ]
    }

    return jsonify(result)

@dashboard_bp.route("/employees/<status>", methods=["GET"])
def get_employees_by_status(status):
    employees = Employee.query \
        .filter(Employee.employment_status.ilike(status)) \
        .with_entities(Employee.full_name, Employee.position_title) \
        .order_by(Employee.full_name).all()

    return jsonify([
        {"full_name": emp.full_name, "position_title": emp.position_title}
        for emp in employees
    ])

@dashboard_bp.route("/upcoming-birthdays", methods=["GET"])
def get_upcoming_birthdays():
    today = datetime.today()
    end_date = today + timedelta(days=30)

    employees = Employee.query.filter(Employee.date_of_birth.isnot(None)).all()

    upcoming = []

    for emp in employees:
        dob = emp.date_of_birth
        try:
            birthday_this_year = dob.replace(year=today.year)
        except ValueError:
            # Handle February 29 on non-leap years
            birthday_this_year = dob.replace(year=today.year, day=28)

        if birthday_this_year < today:
            try:
                birthday_this_year = dob.replace(year=today.year + 1)
            except ValueError:
                birthday_this_year = dob.replace(year=today.year + 1, day=28)

        days_until_birthday = (birthday_this_year - today).days
        if 0 <= days_until_birthday <= 30:
            upcoming.append({
                "full_name": emp.full_name,
                "date": birthday_this_year.strftime("%Y-%m-%d"),
                "age": birthday_this_year.year - dob.year
            })

    upcoming.sort(key=lambda x: x["date"])
    return jsonify(upcoming)
