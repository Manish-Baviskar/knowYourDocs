from fastapi import APIRouter, HTTPException

from services.spatial_service import (
    MineState,
    RiskMapResult,
    SpatialAnalysisRequest,
    SpatialAnalysisResult,
    MineSimulationResult,
    SimulationRequest,
    analyze_spatial_query,
    calculate_risk_map,
    get_mine_state,
    simulate_scenario,
)


router = APIRouter(prefix="/spatial", tags=["Spatial Intelligence"])


@router.get("/sites")
def list_spatial_sites():
    return [{"site_id": "mine-a", "name": "North Karanpura Block A", "source": "synthetic-demo"}]


@router.get("/sites/{site_id}/state", response_model=MineState)
def read_mine_state(site_id: str) -> MineState:
    mine_state = get_mine_state(site_id)
    if mine_state is None:
        raise HTTPException(status_code=404, detail="Mine site not found")
    return mine_state


@router.post("/sites/{site_id}/analyze", response_model=SpatialAnalysisResult)
def analyze_mine(site_id: str, request: SpatialAnalysisRequest) -> SpatialAnalysisResult:
    result = analyze_spatial_query(site_id, request.query)
    if result is None:
        raise HTTPException(status_code=404, detail="Mine site not found")
    return result


@router.get("/sites/{site_id}/risk-zones", response_model=RiskMapResult)
def read_risk_map(site_id: str) -> RiskMapResult:
    risk_map = calculate_risk_map(site_id)
    if risk_map is None:
        raise HTTPException(status_code=404, detail="Mine site not found")
    return risk_map


@router.post("/sites/{site_id}/simulate", response_model=MineSimulationResult)
def simulate_mine(site_id: str, request: SimulationRequest) -> MineSimulationResult:
    result = simulate_scenario(site_id, request)
    if result is None:
        raise HTTPException(status_code=404, detail="Mine site not found")
    return result