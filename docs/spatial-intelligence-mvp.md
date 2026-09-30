# Spatial Intelligence MVP

This implementation connects the Explain & Show, Risk Map, and What-If pages to a deterministic FastAPI spatial service. It is a demonstration implementation: all current mine coordinates and observations are synthetic and must not be used for operational or safety decisions.

## API

All routes use the `mine-a` sample site and are mounted under `/spatial`:

- `GET /spatial/sites` lists available spatial sites and their provenance.
- `GET /spatial/sites/{site_id}/state` returns terrain-zone and equipment records with an observation timestamp.
- `POST /spatial/sites/{site_id}/analyze` accepts `{"query":"..."}` and returns recognized intent, explanation, map highlights, statistics, data source, and timestamp.
- `GET /spatial/sites/{site_id}/risk-zones` returns risk scores, observations, factor contributions, recommendations, calculation method, and disclaimer.
- `POST /spatial/sites/{site_id}/simulate` accepts a `scenario_id`, plus optional `expansion_m` or `depth_increment_m`, and returns current/simulated geometry, metrics, and assumptions.

Set `VITE_API_URL` to override the frontend's default `http://127.0.0.1:8000` API origin.
Set `CORS_ALLOWED_ORIGINS` in the backend environment to a comma-separated list of trusted frontend origins before deployment. The default list is for local development only.

## Demonstration Calculations

Spatial queries currently use deterministic keyword/threshold rules, not a language model. Supported intents are slope threshold, equipment near a numbered bench, high-traffic zones, deep zones, and named risk-zone inspection. Unsupported requests return `recognized: false`; they do not produce invented geometry.

Slope area is the sum of circular zone areas from sample radii; overlapping zones are not unioned. Equipment distance is planar distance to a sample bench reference point, not a surveyed edge or road distance.

Risk score is a weighted rule: slope 25%, traffic 35%, historical events 20%, terrain change 20%. Scores and thresholds are demonstration settings, not calibrated probabilities. The API includes each observation, points, method, and a non-authoritative safety disclaimer.

Scenario formulas use simplified shapes and fixed assumptions. Production impact is intentionally returned as unestimated when required operational inputs are absent. Haul efficiency and congestion deltas are labeled planning assumptions rather than computed predictions.

## Run and Test

From `backend/`:

```powershell
.\venv\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
.\venv\Scripts\python.exe -m unittest discover -s ..\tests -v
```

From `frontend/`:

```powershell
npm.cmd run dev
npm.cmd run build
```

The HTTP integration tests set an in-memory SQLite URL before importing the app; they do not use the configured database.

## Required Before Operational Use

- Replace the sample snapshot with authorized survey/DEM, GIS, fleet telemetry, incident, weather, and geology feeds. Preserve coordinate reference systems, units, source IDs, timestamps, and quality metadata.
- Compute slope from validated terrain surfaces and spatial distances/routes from projected coordinates; account for overlap when computing areas.
- Calibrate and independently validate risk weights, thresholds, and recommendations with qualified geotechnical and mine-safety staff.
- Replace fixed scenario assumptions with surveyed geometry, equipment capacities, road grades, production schedules, and reviewed engineering formulas.
- Add persistence/versioning, user authentication and authorization, audit logs, API rate/size limits, restricted CORS, monitoring, and deployment secrets management.
- Add domain-reviewed acceptance tests using representative mine data and browser tests against a running API.
