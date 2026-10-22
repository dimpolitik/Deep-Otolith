# backend

### Features
- Loads Keras models for prediction
- Rate limit set to 50 images per minute
- Embeds the frontend app
- Bootstrap based theme

## Running the app
From the repository root, create a virtual environment and install the backend dependencies:

```sh
cd code/backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Start the server from `code/backend` so it can find the model files:

```sh
python server.py
```

Open http://localhost:8000. The compiled React frontend is already included in the backend, so a separate frontend build is not needed to run the app.
