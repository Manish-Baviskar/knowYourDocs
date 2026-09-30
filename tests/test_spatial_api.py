import os
import unittest

os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:?check_same_thread=false"

from fastapi.testclient import TestClient
from database.connection import engine
from main import app


class SpatialApiTests(unittest.TestCase):
    def test_spatial_endpoints_serve_consistent_state(self):
        with TestClient(app) as client:
            state = client.get("/spatial/sites/mine-a/state")
            analysis = client.post(
                "/spatial/sites/mine-a/analyze",
                json={"query": "show slope greater than 30 degrees"},
            )
            risk_query = client.post(
                "/spatial/sites/mine-a/analyze",
                json={"query": "inspect risk at Bench 04 Zone A"},
            )
            risk_map = client.get("/spatial/sites/mine-a/risk-zones")
            simulation = client.post(
                "/spatial/sites/mine-a/simulate",
                json={"scenario_id": "bench5-expand", "expansion_m": 10},
            )

        self.assertEqual(state.status_code, 200)
        self.assertEqual(state.json()["source"], "synthetic-demo")
        self.assertEqual(analysis.status_code, 200)
        self.assertEqual(analysis.json()["highlights"][0]["zone_id"], "rz-01")
        self.assertEqual(risk_query.status_code, 200)
        self.assertEqual(risk_query.json()["intent"], "risk")
        self.assertEqual(risk_query.json()["statistics"][0]["value"], "HIGH")
        self.assertEqual(risk_map.status_code, 200)
        self.assertIn("not an authoritative safety decision", risk_map.json()["disclaimer"])
        self.assertEqual(simulation.status_code, 200)
        self.assertEqual(simulation.json()["simulated_geometry"]["width_m"], 48)

    def test_unknown_site_returns_not_found(self):
        with TestClient(app) as client:
            response = client.get("/spatial/sites/unknown-site/state")

        self.assertEqual(response.status_code, 404)

    def test_cors_allows_configured_frontend_and_rejects_other_origins(self):
        with TestClient(app) as client:
            allowed = client.options(
                "/spatial/sites/mine-a/state",
                headers={
                    "Origin": "http://127.0.0.1:5175",
                    "Access-Control-Request-Method": "GET",
                },
            )
            denied = client.options(
                "/spatial/sites/mine-a/state",
                headers={
                    "Origin": "https://untrusted.example",
                    "Access-Control-Request-Method": "GET",
                },
            )

        self.assertEqual(allowed.headers.get("access-control-allow-origin"), "http://127.0.0.1:5175")
        self.assertNotIn("access-control-allow-origin", denied.headers)

    def test_cors_allows_active_vite_port_for_inquiry_requests(self):
        with TestClient(app) as client:
            response = client.options(
                "/documents/parliamentary/inquiries",
                headers={
                    "Origin": "http://127.0.0.1:5176",
                    "Access-Control-Request-Method": "GET",
                },
            )

        self.assertEqual(response.headers.get("access-control-allow-origin"), "http://127.0.0.1:5176")

    @classmethod
    def tearDownClass(cls):
        engine.dispose()
        super().tearDownClass()


if __name__ == "__main__":
    unittest.main()