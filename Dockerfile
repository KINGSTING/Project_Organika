# Use a lightweight Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy dependency list and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all project files
COPY . .

# Expose port 8080 (Northflank default)
EXPOSE 8080

# Run the app using Gunicorn
# Replace "main:app" with "yourfilename:app"
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "main:app"]