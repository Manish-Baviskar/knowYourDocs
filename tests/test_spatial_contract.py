import unittest

from services.spatial_service import (
    SimulationRequest,
    analyze_spatial_query,
    calculate_risk_map,
    get_mine_state,
    simulate_scenario,
)


class SpatialContractTests(unittest.TestCase):
    def test_demo_state_has_spatial_entities_and_provenance(self):
        state = get_mine_state("mine-a")

        self.assertIsNotNone(state)
        assert state is not None
        self.assertEqual(state.source, "synthetic-demo")
        self.assertEqual(len(state.terrain_zones), 6)
        self.assertEqual(len(state.equipment), 6)
        self.assertEqual(state.observed_at.tzinfo.utcoffset(state.observed_at).total_seconds(), 0)

    def test_unknown_site_has_no_state(self):
        self.assertIsNone(get_mine_state("unknown-site"))

    def test_slope_query_uses_threshold_and_returns_zone_geometry(self):
        result = analyze_spatial_query("mine-a", "show zones with slope greater than 30 degrees")

        self.assertIsNotNone(result)
        assert result is not None
        self.assertEqual(result.intent, "slope")
        self.assertEqual([zone.zone_id for zone in result.highlights], ["rz-01"])
        self.assertEqual(result.statistics[0].value, "> 30°")

    def test_equipment_query_calculates_distance_to_bench_reference(self):
        result = analyze_spatial_query("mine-a", "show equipment near Bench 4")

        self.assertIsNotNone(result)
        assert result is not None
        self.assertEqual(result.intent, "equipment")
        self.assertEqual(result.highlights[0].equipment_ids, ["EX-02", "DT-05", "DT-08"])
        self.assertIn("reference point", result.explanation)

    def test_unsupported_query_is_explicit(self):
        result = analyze_spatial_query("mine-a", "what was production last week")

        self.assertIsNotNone(result)
        assert result is not None
        self.assertFalse(result.recognized)
        self.assertEqual(result.intent, "unsupported")

    def test_risk_map_returns_explainable_classifications(self):
        result = calculate_risk_map("mine-a")

        self.assertIsNotNone(result)
        assert result is not None
        levels = {zone.zone_id: zone.level for zone in result.zones}
        self.assertEqual(levels["rz-01"], "HIGH")
        self.assertEqual(levels["rz-02"], "HIGH")
        self.assertEqual(levels["rz-03"], "MEDIUM")
        self.assertEqual(levels["rz-04"], "LOW")
        self.assertTrue(result.zones[0].factors)
        self.assertIn("not an authoritative safety decision", result.disclaimer)

    def test_risk_query_returns_matching_zone_and_risk_level(self):
        result = analyze_spatial_query("mine-a", "inspect risk at Bench 04 Zone A")

        self.assertIsNotNone(result)
        assert result is not None
        self.assertEqual(result.intent, "risk")
        self.assertEqual(result.highlights[0].zone_id, "rz-01")
        self.assertEqual(result.statistics[0].value, "HIGH")

    def test_bench_expansion_calculates_geometry_and_volume(self):
        result = simulate_scenario("mine-a", SimulationRequest(scenario_id="bench5-expand", expansion_m=10))

        self.assertIsNotNone(result)
        assert result is not None
        self.assertEqual(result.simulated_geometry["width_m"], 48)
        area_change = result.metrics[1].change
        volume_change = result.metrics[2].change
        self.assertIsNotNone(area_change)
        self.assertAlmostEqual(volume_change, area_change * 11)
        self.assertIsNone(result.metrics[3].change)

    def test_scenario_parameters_are_bounded(self):
        with self.assertRaises(ValueError):
            SimulationRequest(scenario_id="bench5-expand", expansion_m=25)

    def test_other_scenarios_return_geometry_and_metrics(self):
        depth = simulate_scenario("mine-a", SimulationRequest(scenario_id="depth-increase"))
        relocation = simulate_scenario("mine-a", SimulationRequest(scenario_id="equip-relocation"))
        reroute = simulate_scenario("mine-a", SimulationRequest(scenario_id="haul-reroute"))

        self.assertEqual(depth.simulated_geometry["pit_floor_elevation_m"], -75)
        self.assertEqual(relocation.simulated_geometry["bench"], 3)
        self.assertEqual(reroute.simulated_geometry["haul_route_length_m"], 2220)


if __name__ == "__main__":
    unittest.main()