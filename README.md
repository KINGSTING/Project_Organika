# 🌿 Organika – LGU Plantilla Management System
Organika is a modern web-based application designed to help Local Government Units (LGUs) manage their plantilla items, track employee assignments, and visualize vacancy data with ease. Built for the Human Resource Management Office (HRMO), the system allows for streamlined, transparent, and secure plantilla monitoring across departments.

📌 Features
👥 User Roles
Admin: Full access (create, edit, assign, delete)

Viewer: Read-only access to view plantilla records and dashboard analytics

📋 Plantilla Management
View all plantilla items in a searchable table

Add, update, or delete plantilla entries (Admin only)

Assign employees to plantilla items

Filter by office, salary grade, or employment status

📊 Dashboard Analytics
Total plantilla items

Filled vs. Vacant vs. Frozen positions

Distribution by office and salary grade

Funded vs. unfunded items

👤 Employee Management
View and add employee records

Assign employees to plantilla items

Track appointment dates and employment status

🛠️ Tech Stack
🔗 Frontend
React (via Vite)

Tailwind CSS or Material UI

Axios + React Router

🔌 Backend
Flask

SQLAlchemy ORM

Flask-JWT for authentication

Hosted on Render

🗄️ Database
PostgreSQL

Hosted on Neon.tech

🚀 Deployment
Frontend: Vercel

Backend: Render

Database: Neon

🧪 How to Run (Locally)
🔹 Backend
bash
Copy
Edit
cd organika-backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
flask run
🔹 Frontend
bash
Copy
Edit
cd organika-frontend
npm install
npm run dev
Ensure .env files are correctly configured for both frontend and backend.

📚 Future Enhancements
File attachments (e.g., appointment memos)

Retirement forecasting

Notification system for vacant positions

Audit logs

Export to CSV/PDF

👨‍💼 Developed By
Jemar John J. Lumingkit

For: LGU - Organic Kauswagan

📍 Mindanao State University - Iligan Institute of Technology

