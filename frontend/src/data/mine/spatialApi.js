const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function request(path, options) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Spatial API returned ${response.status}`);
  }
  return response.json();
}

export function fetchMineState(siteId) {
  return request(`/spatial/sites/${encodeURIComponent(siteId)}/state`);
}

export function analyzeMineQuery(siteId, query) {
  return request(`/spatial/sites/${encodeURIComponent(siteId)}/analyze`, {
    method: "POST",
    body: JSON.stringify({ query }),
  });
}

export function fetchMineRiskMap(siteId) {
  return request(`/spatial/sites/${encodeURIComponent(siteId)}/risk-zones`);
}

export function simulateMineScenario(siteId, scenario) {
  return request(`/spatial/sites/${encodeURIComponent(siteId)}/simulate`, {
    method: "POST",
    body: JSON.stringify(scenario),
  });
}