import os
import pytest
import requests

BASE_URL = os.environ.get('EXPO_PUBLIC_BACKEND_URL', 'https://palette-craft-8.preview.emergentagent.com').rstrip('/')


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Stats ----------
class TestStats:
    def test_stats_schema(self, api):
        r = api.get(f"{BASE_URL}/api/stats")
        assert r.status_code == 200
        d = r.json()
        for k in ["packages_dissolved", "co2_saved_kg", "water_saved_l",
                  "soil_enriched_g", "streak_days", "garden_level", "garden_progress"]:
            assert k in d, f"missing {k}"
        assert isinstance(d["packages_dissolved"], int)
        assert 0.0 <= d["garden_progress"] <= 1.0


# ---------- Activities ----------
class TestActivities:
    def test_activities_list(self, api):
        r = api.get(f"{BASE_URL}/api/activities")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 4
        first = data[0]
        for k in ["id", "title", "subtitle", "impact_label", "icon", "timestamp"]:
            assert k in first


# ---------- Profile / Challenges / Badges ----------
class TestSeedLists:
    def test_profile(self, api):
        r = api.get(f"{BASE_URL}/api/profile")
        assert r.status_code == 200
        d = r.json()
        assert d["name"] == "Amelia"
        assert "total_points" in d and "rank" in d

    def test_challenges(self, api):
        r = api.get(f"{BASE_URL}/api/challenges")
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 4
        assert any(c["id"] == "c1" for c in data)

    def test_badges(self, api):
        r = api.get(f"{BASE_URL}/api/badges")
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 6
        assert any(b["id"] == "b1" for b in data)

    def test_articles_list(self, api):
        r = api.get(f"{BASE_URL}/api/articles")
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 4

    def test_materials_list(self, api):
        r = api.get(f"{BASE_URL}/api/materials")
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 4


# ---------- Detail lookups ----------
class TestDetails:
    def test_article_a1(self, api):
        r = api.get(f"{BASE_URL}/api/articles/a1")
        assert r.status_code == 200
        d = r.json()
        assert d["id"] == "a1"
        assert "Seaweed" in d["title"]

    def test_article_404(self, api):
        r = api.get(f"{BASE_URL}/api/articles/zzz")
        assert r.status_code == 404

    def test_material_m1(self, api):
        r = api.get(f"{BASE_URL}/api/materials/m1")
        assert r.status_code == 200
        d = r.json()
        assert d["id"] == "m1"
        assert isinstance(d["nutrients"], list) and len(d["nutrients"]) >= 1
        assert isinstance(d["instructions"], list) and len(d["instructions"]) >= 1

    def test_material_404(self, api):
        r = api.get(f"{BASE_URL}/api/materials/zzz")
        assert r.status_code == 404


# ---------- Dissolve mutation ----------
class TestDissolve:
    def test_dissolve_increments(self, api):
        before = api.get(f"{BASE_URL}/api/stats").json()
        r = api.post(f"{BASE_URL}/api/dissolve", json={"material_id": "m1", "method": "Soil"})
        assert r.status_code == 200
        body = r.json()
        assert body["success"] is True
        assert "stats" in body and "activity" in body
        assert body["stats"]["packages_dissolved"] == before["packages_dissolved"] + 1
        # verify persisted via GET
        after = api.get(f"{BASE_URL}/api/stats").json()
        assert after["packages_dissolved"] == before["packages_dissolved"] + 1
        # activity inserted at top
        acts = api.get(f"{BASE_URL}/api/activities").json()
        assert acts[0]["id"] == body["activity"]["id"]
