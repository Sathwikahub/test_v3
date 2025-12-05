# Animation Calculator

A simple, animated calculator web application with a Flask backend and plain HTML/CSS/JavaScript frontend.

## Quick Start

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (optional but recommended):**
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On Mac/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask server:**
   ```bash
   python app.py
   ```

5. **Open your browser:**
   Navigate to `http://127.0.0.1:5000`

## Testing

### Run Automated Tests with pytest

From the project root directory:

```bash
# Activate virtual environment first
.venv\Scripts\activate  # On Windows
# OR
source .venv/bin/activate  # On Mac/Linux

# Run all tests
pytest backend/test_app.py -v

# Or just run pytest from project root
pytest -v
```

This will run 16 comprehensive tests covering all calculator operations, error handling, and API endpoints.

### Test via UI
Simply open `http://127.0.0.1:5000` in your browser and use the calculator form.

### Test API with PowerShell
You can test the `/calculate` endpoint using PowerShell's `Invoke-RestMethod`:

```powershell
# Example: Multiply 10 by 5
Invoke-RestMethod -Uri http://127.0.0.1:5000/calculate -Method POST -Body (@{num1=10; num2=5; operator="*"} | ConvertTo-Json) -ContentType "application/json"

# Example: Add 20 and 15
Invoke-RestMethod -Uri http://127.0.0.1:5000/calculate -Method POST -Body (@{num1=20; num2=15; operator="+"} | ConvertTo-Json) -ContentType "application/json"

# Test health endpoint
Invoke-RestMethod -Uri http://127.0.0.1:5000/health -Method GET
```
