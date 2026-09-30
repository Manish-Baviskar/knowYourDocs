from datetime import datetime, timezone
import math
import re
from typing import Literal

from pydantic import BaseModel, Field


class TerrainZone(BaseModel):
    id: str
    label: str
    x: float
    z: float
    radius: float = Field(gt=0)
    slope_degrees: float = Field(ge=0, le=90)
    traffic_level: Literal["LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
    historical_events: int = Field(ge=0)
    terrain_change: Literal["NONE", "MINOR", "MODERATE", "SIGNIFICANT"]
    elevation_m: float
    bench: int | None = None


class EquipmentAsset(BaseModel):
    id: str
    kind: str
    status: Literal["ACTIVE", "IDLE", "MAINTENANCE"]
    x: float
    z: float
    bench: int


class MineState(BaseModel):
    site_id: str
    site_name: str
    location: str
    source: Literal["synthetic-demo"]
    observed_at: datetime
    terrain_zones: list[TerrainZone]
    equipment: list[EquipmentAsset]


class SpatialAnalysisRequest(BaseModel):
    query: str = Field(min_length=3, max_length=500)


class SpatialHighlight(BaseModel):
    zone_id: str
    label: str
    x: float
    z: float
    radius: float
    kind: Literal["slope", "equipment", "traffic", "seam", "risk"]
    y: float
    bench_number: int | None = None
    equipment_ids: list[str] = Field(default_factory=list)


class SpatialStatistic(BaseModel):
    label: str
    value: str


class SpatialAnalysisResult(BaseModel):
    recognized: bool
    intent: Literal["slope", "equipment", "traffic", "seam", "risk", "unsupported"]
    explanation: str
    highlights: list[SpatialHighlight]
    statistics: list[SpatialStatistic]
    data_source: str
    observed_at: datetime


class RiskFactor(BaseModel):
    name: str
    observation: str
    points: float
    maximum_points: float


class RiskZoneResult(BaseModel):
    zone_id: str
    label: str
    x: float
    y: float
    z: float
    radius: float
    score: float
    level: Literal["LOW", "MEDIUM", "HIGH"]
    factors: list[RiskFactor]
    primary_factors: list[str]
    recommendation: str


class RiskMapResult(BaseModel):
    data_source: str
    observed_at: datetime
    method: str
    disclaimer: str
    zones: list[RiskZoneResult]


class SimulationRequest(BaseModel):
    scenario_id: Literal["bench5-expand", "depth-increase", "equip-relocation", "haul-reroute"]
    expansion_m: float = Field(default=10, gt=0, le=20)
    depth_increment_m: float = Field(default=8, gt=0, le=20)


class SimulationMetric(BaseModel):
    name: str
    current_value: float | None
    simulated_value: float | None
    change: float | None
    unit: str
    basis: str


class MineSimulationResult(BaseModel):
    scenario_id: str
    data_source: str
    current_geometry: dict[str, float | int | str]
    simulated_geometry: dict[str, float | int | str]
    metrics: list[SimulationMetric]
    assumptions: list[str]


_SAMPLE_ZONES = [
    {"id": "rz-01", "label": "Bench 04 – Zone A", "x": 25, "z": -15, "radius": 22, "slope_degrees": 34, "traffic_level": "HIGH", "historical_events": 3, "terrain_change": "SIGNIFICANT", "elevation_m": -30, "bench": 4},
    {"id": "rz-02", "label": "North Haul Road Junction", "x": -40, "z": 50, "radius": 18, "slope_degrees": 12, "traffic_level": "VERY_HIGH", "historical_events": 1, "terrain_change": "MODERATE", "elevation_m": 2},
    {"id": "rz-03", "label": "Bench 06 – South Wall", "x": -10, "z": 30, "radius": 16, "slope_degrees": 27, "traffic_level": "MEDIUM", "historical_events": 1, "terrain_change": "MINOR", "elevation_m": -20, "bench": 6},
    {"id": "rz-04", "label": "Eastern Dump Zone", "x": 60, "z": 20, "radius": 20, "slope_degrees": 8, "traffic_level": "MEDIUM", "historical_events": 0, "terrain_change": "MODERATE", "elevation_m": 2},
    {"id": "rz-05", "label": "Bench 02 – Central Zone", "x": 0, "z": 5, "radius": 28, "slope_degrees": 18, "traffic_level": "LOW", "historical_events": 0, "terrain_change": "NONE", "elevation_m": -10, "bench": 2},
    {"id": "rz-06", "label": "Bench 08 – Base Level", "x": 5, "z": -5, "radius": 18, "slope_degrees": 15, "traffic_level": "LOW", "historical_events": 0, "terrain_change": "NONE", "elevation_m": -55, "bench": 8},
]

_SAMPLE_EQUIPMENT = [
    {"id": "EX-01", "kind": "Shovel Excavator", "status": "ACTIVE", "x": 28, "z": 10, "bench": 5},
    {"id": "EX-02", "kind": "Shovel Excavator", "status": "ACTIVE", "x": 18, "z": -20, "bench": 4},
    {"id": "DT-05", "kind": "85T Dump Truck", "status": "ACTIVE", "x": 35, "z": -12, "bench": 4},
    {"id": "DT-08", "kind": "85T Dump Truck", "status": "ACTIVE", "x": 22, "z": -35, "bench": 4},
    {"id": "DR-01", "kind": "Drill Rig", "status": "IDLE", "x": -18, "z": 8, "bench": 3},
    {"id": "DZ-02", "kind": "Dozer", "status": "ACTIVE", "x": -30, "z": 30, "bench": 2},
]

_RISK_RECOMMENDATIONS = {
    "rz-01": "Bench 04, Zone A — Priority geotechnical inspection recommended.",
    "rz-02": "North Junction — Review lighting, speed controls, and traffic separation.",
    "rz-03": "Bench 06 South — Schedule a slope survey and review equipment proximity.",
    "rz-04": "Eastern Dump — Monitor dump height and ground consolidation.",
    "rz-05": "Continue routine bench and traffic monitoring.",
    "rz-06": "Continue standard geotechnical monitoring at the pit base.",
}


def get_mine_state(site_id: str) -> MineState | None:
    if site_id != "mine-a":
        return None

    return MineState(
        site_id="mine-a",
        site_name="North Karanpura Block A",
        location="Jharkhand",
        source="synthetic-demo",
        observed_at=datetime.now(timezone.utc),
        terrain_zones=[TerrainZone(**zone) for zone in _SAMPLE_ZONES],
        equipment=[EquipmentAsset(**asset) for asset in _SAMPLE_EQUIPMENT],
    )


def analyze_spatial_query(site_id: str, query: str) -> SpatialAnalysisResult | None:
    state = get_mine_state(site_id)
    if state is None:
        return None

    normalized = re.sub(r"\s+", " ", query.lower().replace("–", " ").replace("-", " ")).strip()
    if any(term in normalized for term in ("risk", "hazard", "incident", "inspection")):
        risk_map = calculate_risk_map(site_id)
        assert risk_map is not None
        bench_match = re.search(r"bench\s*0?(\d+)", normalized)
        zone_match = re.search(r"zone\s+([a-z])", normalized)
        exact_zone = next(
            (
                zone
                for zone in risk_map.zones
                if zone.label.lower().replace("–", " ").replace("-", " ") in normalized
            ),
            None,
        )
        if exact_zone:
            candidates = [exact_zone]
        else:
            candidates = risk_map.zones
            if bench_match:
                bench_pattern = rf"bench\s*0?{bench_match.group(1)}\b"
                candidates = [zone for zone in candidates if re.search(bench_pattern, zone.label.lower())]
            if zone_match:
                candidates = [zone for zone in candidates if re.search(rf"zone\s+{zone_match.group(1)}\b", zone.label.lower())]
            if not bench_match and not zone_match:
                candidates = [zone for zone in candidates if zone.level == "HIGH"]

        selected = candidates[0] if candidates else None
        if selected is None:
            return SpatialAnalysisResult(
                recognized=False,
                intent="risk",
                explanation="No matching sample risk zone was found. Name a bench or zone, such as Bench 04 Zone A.",
                highlights=[],
                statistics=[],
                data_source=risk_map.data_source,
                observed_at=risk_map.observed_at,
            )

        source_zone = next(zone for zone in state.terrain_zones if zone.id == selected.zone_id)
        highlight = SpatialHighlight(
            zone_id=selected.zone_id,
            label=selected.label,
            x=selected.x,
            y=selected.y,
            z=selected.z,
            radius=selected.radius,
            kind="risk",
            bench_number=source_zone.bench,
        )
        observations = {factor.name: factor.observation for factor in selected.factors}
        statistics = [
            SpatialStatistic(label="Risk Level", value=selected.level),
            SpatialStatistic(label="Risk Score", value=f"{selected.score:g}/100"),
            SpatialStatistic(label="Slope", value=observations["Slope"]),
            SpatialStatistic(label="Historical Events", value=observations["Historical events"]),
        ]
        explanation = (
            f"{selected.level} demonstration risk indicator for {selected.label} "
            f"(score {selected.score:g}/100). Primary factors: "
            f"{', '.join(selected.primary_factors) or 'no dominant factor'}. "
            f"{risk_map.disclaimer}"
        )
        return SpatialAnalysisResult(
            recognized=True,
            intent="risk",
            explanation=explanation,
            highlights=[highlight],
            statistics=statistics,
            data_source=risk_map.data_source,
            observed_at=risk_map.observed_at,
        )

    if "slope" in normalized or "incline" in normalized or "steep" in normalized:
        threshold_match = re.search(
            r"(?:greater than|more than|above|over|exceeding|>)\s*(\d+(?:\.\d+)?)\s*(?:°|degrees?)?",
            normalized,
        )
        threshold = float(threshold_match.group(1)) if threshold_match else 30.0
        zones = [zone for zone in state.terrain_zones if zone.slope_degrees > threshold]
        area_km2 = sum(math.pi * zone.radius**2 for zone in zones) / 1_000_000
        values = [zone.slope_degrees for zone in zones]
        statistics = [
            SpatialStatistic(label="Threshold", value=f"> {threshold:g}°"),
            SpatialStatistic(label="Flagged Zones", value=str(len(zones))),
            SpatialStatistic(label="Maximum Slope", value=f"{max(values):g}°" if values else "None"),
            SpatialStatistic(label="Estimated Area", value=f"{area_km2:.3f} km²"),
        ]
        highlights = [self_zone(zone, "slope") for zone in zones]
        explanation = f"{len(zones)} sample zone(s) exceed the {threshold:g}° slope threshold. Area is estimated from zone radii and may overlap."
        return SpatialAnalysisResult(recognized=True, intent="slope", explanation=explanation, highlights=highlights, statistics=statistics, data_source=state.source, observed_at=state.observed_at)

    if any(term in normalized for term in ("equipment", "vehicle", "truck", "excavator", "shovel")):
        bench_match = re.search(r"bench\s*0?(\d+)", normalized)
        if bench_match:
            bench_number = int(bench_match.group(1))
            zones = [zone for zone in state.terrain_zones if zone.bench == bench_number]
            assets = [asset for asset in state.equipment if asset.bench == bench_number]
            reference_zone = zones[0] if zones else None
            distances = [
                (asset, math.hypot(asset.x - reference_zone.x, asset.z - reference_zone.z))
                for asset in assets
            ] if reference_zone else []
            ids = [asset.id for asset, _ in distances]
            highlights = [self_zone(reference_zone, "equipment", ids)] if reference_zone else []
            nearest = min((distance for _, distance in distances), default=None)
            statistics = [
                SpatialStatistic(label="Bench", value=f"Bench {bench_number:02d}"),
                SpatialStatistic(label="Equipment Units", value=str(len(assets))),
                SpatialStatistic(label="Nearest Reference Distance", value=f"{nearest:.1f} m" if nearest is not None else "None"),
            ]
            explanation = f"Found {len(assets)} sample equipment unit(s) assigned to Bench {bench_number:02d}; distance is measured from the bench reference point."
            return SpatialAnalysisResult(recognized=True, intent="equipment", explanation=explanation, highlights=highlights, statistics=statistics, data_source=state.source, observed_at=state.observed_at)

    if any(term in normalized for term in ("traffic", "haul", "road", "corridor", "congestion")):
        zones = [zone for zone in state.terrain_zones if zone.traffic_level in {"HIGH", "VERY_HIGH"}]
        highlights = [self_zone(zone, "traffic") for zone in zones]
        statistics = [
            SpatialStatistic(label="High-Traffic Zones", value=str(len(zones))),
            SpatialStatistic(label="Highest Traffic", value=max((zone.traffic_level for zone in zones), default="None")),
        ]
        return SpatialAnalysisResult(recognized=True, intent="traffic", explanation=f"Found {len(zones)} sample zone(s) with high or very high traffic indicators.", highlights=highlights, statistics=statistics, data_source=state.source, observed_at=state.observed_at)

    if any(term in normalized for term in ("coal", "seam", "deep", "stratigraphy")):
        zones = [zone for zone in state.terrain_zones if zone.elevation_m <= -50]
        highlights = [self_zone(zone, "seam") for zone in zones]
        statistics = [
            SpatialStatistic(label="Deep Zones", value=str(len(zones))),
            SpatialStatistic(label="Deepest Elevation", value=f"{min((zone.elevation_m for zone in zones), default=0):g} m"),
        ]
        return SpatialAnalysisResult(recognized=True, intent="seam", explanation=f"Found {len(zones)} sample zone(s) at or below -50 m elevation.", highlights=highlights, statistics=statistics, data_source=state.source, observed_at=state.observed_at)

    return SpatialAnalysisResult(
        recognized=False,
        intent="unsupported",
        explanation="Supported analyses: slope thresholds, equipment near a numbered bench, haul-road traffic, and deep seam zones.",
        highlights=[],
        statistics=[],
        data_source=state.source,
        observed_at=state.observed_at,
    )


def calculate_risk_map(site_id: str) -> RiskMapResult | None:
    state = get_mine_state(site_id)
    if state is None:
        return None

    traffic_points = {"LOW": 0.0, "MEDIUM": 35 / 3, "HIGH": 70 / 3, "VERY_HIGH": 35.0}
    change_points = {"NONE": 0.0, "MINOR": 20 / 3, "MODERATE": 40 / 3, "SIGNIFICANT": 20.0}
    results = []
    for zone in state.terrain_zones:
        factors = [
            RiskFactor(
                name="Slope",
                observation=f"{zone.slope_degrees:g}°",
                points=round(min(zone.slope_degrees / 40, 1) * 25, 1),
                maximum_points=25,
            ),
            RiskFactor(
                name="Equipment traffic",
                observation=zone.traffic_level.replace("_", " "),
                points=round(traffic_points[zone.traffic_level], 1),
                maximum_points=35,
            ),
            RiskFactor(
                name="Historical events",
                observation=str(zone.historical_events),
                points=round(min(zone.historical_events, 3) / 3 * 20, 1),
                maximum_points=20,
            ),
            RiskFactor(
                name="Terrain change",
                observation=zone.terrain_change.lower(),
                points=round(change_points[zone.terrain_change], 1),
                maximum_points=20,
            ),
        ]
        score = round(sum(factor.points for factor in factors), 1)
        level = "HIGH" if score >= 60 else "MEDIUM" if score >= 35 else "LOW"
        primary = [
            factor.name
            for factor in factors
            if factor.points >= factor.maximum_points * 0.6
        ]
        results.append(
            RiskZoneResult(
                zone_id=zone.id,
                label=zone.label,
                x=zone.x,
                y=zone.elevation_m,
                z=zone.z,
                radius=zone.radius,
                score=score,
                level=level,
                factors=factors,
                primary_factors=primary,
                recommendation=_RISK_RECOMMENDATIONS[zone.id],
            )
        )

    return RiskMapResult(
        data_source=state.source,
        observed_at=state.observed_at,
        method="Weighted demonstration rule v1: slope 25%, traffic 35%, events 20%, terrain change 20%.",
        disclaimer="AI-assisted demonstration indicator only; not an authoritative safety decision. Validate with qualified mine-safety and geotechnical staff.",
        zones=results,
    )


def simulate_scenario(site_id: str, request: SimulationRequest) -> MineSimulationResult | None:
    state = get_mine_state(site_id)
    if state is None:
        return None

    current: dict[str, float | int | str] = {}
    simulated: dict[str, float | int | str] = {}
    metrics: list[SimulationMetric] = []
    assumptions: list[str] = ["Demonstration geometry only; replace sample dimensions with surveyed mine data before operational use."]

    if request.scenario_id == "bench5-expand":
        current_width = 38.0
        simulated_width = current_width + request.expansion_m
        bench_height = 11.0
        current_area = math.pi * (current_width / 2) ** 2
        simulated_area = math.pi * (simulated_width / 2) ** 2
        area_change = simulated_area - current_area
        volume_change = area_change * bench_height
        current = {"bench": 5, "width_m": current_width}
        simulated = {"bench": 5, "width_m": simulated_width}
        metrics = [
            SimulationMetric(name="Bench width", current_value=current_width, simulated_value=simulated_width, change=request.expansion_m, unit="m", basis="Requested expansion parameter."),
            SimulationMetric(name="Affected area", current_value=current_area, simulated_value=simulated_area, change=area_change, unit="m²", basis="Circular footprint approximation from bench width."),
            SimulationMetric(name="Volume change", current_value=0, simulated_value=volume_change, change=volume_change, unit="m³", basis=f"Affected area multiplied by assumed {bench_height:g} m bench height."),
            SimulationMetric(name="Production impact", current_value=None, simulated_value=None, change=None, unit="", basis="Not estimated: production rate and coal recovery inputs are unavailable."),
        ]
        assumptions.append(f"Bench 5 is approximated as circular with {bench_height:g} m vertical height.")

    elif request.scenario_id == "depth-increase":
        current_floor = -67.0
        simulated_floor = current_floor - request.depth_increment_m
        floor_area = math.pi * 5**2
        volume_change = floor_area * request.depth_increment_m
        ramp_extension = request.depth_increment_m * 12
        current = {"pit_floor_elevation_m": current_floor, "ramp_length_m": 0}
        simulated = {"pit_floor_elevation_m": simulated_floor, "ramp_length_m": ramp_extension}
        metrics = [
            SimulationMetric(name="Pit floor elevation", current_value=current_floor, simulated_value=simulated_floor, change=-request.depth_increment_m, unit="m", basis="Requested depth increment."),
            SimulationMetric(name="Volume change", current_value=0, simulated_value=volume_change, change=volume_change, unit="m³", basis="Assumed 5 m pit-floor radius multiplied by depth increment."),
            SimulationMetric(name="Ramp extension", current_value=0, simulated_value=ramp_extension, change=ramp_extension, unit="m", basis="Assumed 1:12 ramp grade."),
            SimulationMetric(name="Production impact", current_value=None, simulated_value=None, change=None, unit="", basis="Not estimated: production rate and coal recovery inputs are unavailable."),
        ]
        assumptions.append("Pit-floor radius is assumed to be 5 m; ramp grade is assumed to be 1:12.")

    elif request.scenario_id == "equip-relocation":
        equipment = next(asset for asset in state.equipment if asset.id == "EX-01")
        destination = (-18.0, 8.0)
        distance = math.hypot(equipment.x - destination[0], equipment.z - destination[1])
        current = {"equipment_id": equipment.id, "bench": equipment.bench, "x": equipment.x, "z": equipment.z}
        simulated = {"equipment_id": equipment.id, "bench": 3, "x": destination[0], "z": destination[1]}
        metrics = [
            SimulationMetric(name="Relocated equipment", current_value=1, simulated_value=1, change=0, unit="units", basis=f"Sample asset {equipment.id} moved to the Bench 3 reference point."),
            SimulationMetric(name="Relocation distance", current_value=0, simulated_value=distance, change=distance, unit="m", basis="Planar distance between sample asset and destination coordinates."),
            SimulationMetric(name="Production impact", current_value=None, simulated_value=None, change=None, unit="", basis="Not estimated: equipment capacity and production schedule inputs are unavailable."),
        ]
        assumptions.append("Bench 3 destination uses a demonstration reference coordinate at (-18, 8).")

    else:
        current_length = 1800.0
        bypass_length = 420.0
        simulated_length = current_length + bypass_length
        footprint_area = bypass_length * 18
        current = {"haul_route_length_m": current_length}
        simulated = {"haul_route_length_m": simulated_length, "bypass_length_m": bypass_length}
        metrics = [
            SimulationMetric(name="Haul route length", current_value=current_length, simulated_value=simulated_length, change=bypass_length, unit="m", basis="Sample route length plus proposed bypass."),
            SimulationMetric(name="Affected area", current_value=0, simulated_value=footprint_area, change=footprint_area, unit="m²", basis="420 m bypass with assumed 18 m footprint width."),
            SimulationMetric(name="Haul efficiency", current_value=0, simulated_value=8, change=8, unit="%", basis="Demonstration planning assumption; not computed from fleet telemetry."),
            SimulationMetric(name="Congestion incidents", current_value=0, simulated_value=-15, change=-15, unit="%", basis="Demonstration planning assumption; validate against traffic observations."),
        ]
        assumptions.append("Existing route length is assumed to be 1,800 m; bypass width is assumed to be 18 m.")

    return MineSimulationResult(
        scenario_id=request.scenario_id,
        data_source=state.source,
        current_geometry=current,
        simulated_geometry=simulated,
        metrics=metrics,
        assumptions=assumptions,
    )


def self_zone(zone: TerrainZone, kind: Literal["slope", "equipment", "traffic", "seam", "risk"], equipment_ids: list[str] | None = None) -> SpatialHighlight:
    return SpatialHighlight(
        zone_id=zone.id,
        label=zone.label,
        x=zone.x,
        y=zone.elevation_m,
        z=zone.z,
        radius=zone.radius,
        kind=kind,
        bench_number=zone.bench,
        equipment_ids=equipment_ids or [],
    )