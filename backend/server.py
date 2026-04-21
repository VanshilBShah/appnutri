from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="NutriLoop API")
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class ImpactStats(BaseModel):
    packages_dissolved: int
    co2_saved_kg: float
    water_saved_l: float
    soil_enriched_g: float
    streak_days: int
    garden_level: int
    garden_progress: float  # 0..1 toward next level


class Activity(BaseModel):
    id: str
    title: str
    subtitle: str
    impact_label: str
    icon: str
    timestamp: str


class Article(BaseModel):
    id: str
    title: str
    category: str
    read_time: str
    image: str
    excerpt: str
    body: str


class Material(BaseModel):
    id: str
    name: str
    category: str
    dissolve_time: str
    method: str
    nutrients: List[str]
    instructions: List[str]
    image: str


class Challenge(BaseModel):
    id: str
    title: str
    description: str
    reward_points: int
    progress: float
    target: int
    current: int
    icon: str
    completed: bool


class Badge(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    unlocked: bool


class Profile(BaseModel):
    name: str
    tagline: str
    member_since: str
    total_points: int
    rank: str


# ---------- Seed data ----------
ARTICLES = [
    {
        "id": "a1",
        "title": "The Science of Seaweed Packaging",
        "category": "Material Science",
        "read_time": "4 min read",
        "image": "https://images.unsplash.com/photo-1681178519331-09cdb1e3ff19?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzV8MHwxfHNlYXJjaHwyfHxncmVlbiUyMGxlYWYlMjBtaW5pbWFsfGVufDB8fHx8MTc3Njc4ODE5M3ww&ixlib=rb-4.1.0&q=85",
        "excerpt": "How brown seaweed becomes packaging that dissolves into plant food.",
        "body": "Seaweed alginate forms the structural backbone of NutriLoop's regenerative packaging. When combined with cassava starch and rice husk fibers, it creates a film that is water-resistant during use yet fully dissolvable after. When the package meets soil or water, alginate breaks down in 4–8 weeks, releasing potassium, calcium, and trace minerals that nourish microbial life.\n\nUnlike compostable plastics that require industrial facilities, NutriLoop returns value to the earth wherever it lands — a backyard garden, a park, or the ocean.",
    },
    {
        "id": "a2",
        "title": "What 'Circular' Really Means",
        "category": "Circular Design",
        "read_time": "3 min read",
        "image": "https://images.pexels.com/photos/13567645/pexels-photo-13567645.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "excerpt": "Moving beyond recycling to packaging that actively gives back.",
        "body": "The linear economy takes, makes, and wastes. The circular economy aims to eliminate waste — but most 'circular' systems still downgrade materials with every loop.\n\nNutriLoop proposes a third path: regenerative design. Our packaging doesn't just avoid harm; it deposits nutrients that rebuild topsoil, which has been depleted globally by 33% since industrial farming began. Every mailer you dissolve is a small act of repair.",
    },
    {
        "id": "a3",
        "title": "Soil Health 101",
        "category": "Earth Science",
        "read_time": "5 min read",
        "image": "https://images.pexels.com/photos/7944395/pexels-photo-7944395.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "excerpt": "Why the top six inches of earth matter more than you think.",
        "body": "Healthy soil contains more microorganisms in a teaspoon than there are humans on Earth. These microbes fix nitrogen, cycle carbon, and defend plants from disease — all for free.\n\nNutriLoop packaging contains prebiotic polysaccharides that feed soil microbiome diversity. A single dissolved mailer can measurably boost microbial activity within a 10cm radius for 3–6 months.",
    },
    {
        "id": "a4",
        "title": "From Ocean to Earth",
        "category": "Sustainability",
        "read_time": "3 min read",
        "image": "https://images.unsplash.com/photo-1601662528567-526cd06f6582?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxwYXBlciUyMHRleHR1cmUlMjBiYWNrZ3JvdW5kfGVufDB8fHx8MTc3Njc4ODE5OHww&ixlib=rb-4.1.0&q=85",
        "excerpt": "Our feedstock is farmed — not extracted — and sequesters carbon while it grows.",
        "body": "Seaweed is one of the fastest growing organisms on the planet, requiring no land, no freshwater, and no fertilizer. Every hectare of seaweed farm sequesters up to 20 tons of CO2 annually and creates habitat for marine life.\n\nBy sourcing from community-operated kelp farms along coastal regions, NutriLoop supports small fishing economies while turning a waste problem into a regenerative cycle.",
    },
]

MATERIALS = [
    {
        "id": "m1",
        "name": "NutriLoop Mailer",
        "category": "Shipping",
        "dissolve_time": "4–6 weeks in soil",
        "method": "Soil burial",
        "nutrients": ["Potassium", "Calcium", "Trace minerals"],
        "instructions": [
            "Tear the mailer into 4–6 pieces.",
            "Bury 10–15 cm deep in garden soil or a potted plant.",
            "Water lightly. Full dissolution in 4–6 weeks.",
            "No composting facility required.",
        ],
        "image": "https://images.pexels.com/photos/10793124/pexels-photo-10793124.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
        "id": "m2",
        "name": "Flexible Film Wrap",
        "category": "Food",
        "dissolve_time": "Instant in warm water",
        "method": "Warm water dissolution",
        "nutrients": ["Magnesium", "Iron"],
        "instructions": [
            "Submerge in warm water (40°C+).",
            "Film dissolves in 30–60 seconds.",
            "Pour residual water on plants — it's plant food.",
        ],
        "image": "https://images.pexels.com/photos/7944395/pexels-photo-7944395.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
        "id": "m3",
        "name": "Protective Insert",
        "category": "Shipping",
        "dissolve_time": "2–3 weeks in compost",
        "method": "Composting or soil",
        "nutrients": ["Silica", "Potassium"],
        "instructions": [
            "Break into smaller pieces.",
            "Add to home compost bin or bury in soil.",
            "Fully breaks down in 2–3 weeks.",
        ],
        "image": "https://images.unsplash.com/photo-1681178519331-09cdb1e3ff19?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzV8MHwxfHNlYXJjaHwyfHxncmVlbiUyMGxlYWYlMjBtaW5pbWFsfGVufDB8fHx8MTc3Njc4ODE5M3ww&ixlib=rb-4.1.0&q=85",
    },
    {
        "id": "m4",
        "name": "Cup Lid",
        "category": "Food",
        "dissolve_time": "1 week in soil",
        "method": "Soil or backyard",
        "nutrients": ["Calcium", "Phosphorus"],
        "instructions": [
            "Rinse off any residue.",
            "Place in soil, garden, or green waste.",
            "Dissolves fully in about 7 days.",
        ],
        "image": "https://images.pexels.com/photos/13567645/pexels-photo-13567645.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
]

ACTIVITIES = [
    {"id": "act1", "title": "Mailer dissolved", "subtitle": "Garden soil • Backyard", "impact_label": "+2 pkg", "icon": "leaf", "timestamp": "Today, 9:12 AM"},
    {"id": "act2", "title": "Film wrap dissolved", "subtitle": "Kitchen • Warm water", "impact_label": "+1 pkg", "icon": "water", "timestamp": "Yesterday, 7:30 PM"},
    {"id": "act3", "title": "Article read", "subtitle": "Soil Health 101", "impact_label": "+10 pts", "icon": "book", "timestamp": "Yesterday, 2:15 PM"},
    {"id": "act4", "title": "Challenge completed", "subtitle": "5-day dissolve streak", "impact_label": "+50 pts", "icon": "star", "timestamp": "2 days ago"},
]

CHALLENGES = [
    {"id": "c1", "title": "7-Day Dissolve Streak", "description": "Dissolve a package every day for a week.", "reward_points": 100, "progress": 0.57, "target": 7, "current": 4, "icon": "flame", "completed": False},
    {"id": "c2", "title": "Soil Scientist", "description": "Read all 4 articles in the Education Hub.", "reward_points": 40, "progress": 0.75, "target": 4, "current": 3, "icon": "book", "completed": False},
    {"id": "c3", "title": "First Sprout", "description": "Dissolve your first NutriLoop package.", "reward_points": 20, "progress": 1.0, "target": 1, "current": 1, "icon": "sprout", "completed": True},
    {"id": "c4", "title": "Ocean Guardian", "description": "Dissolve 25 packages total.", "reward_points": 200, "progress": 0.52, "target": 25, "current": 13, "icon": "waves", "completed": False},
]

BADGES = [
    {"id": "b1", "name": "First Sprout", "description": "Your first dissolved package.", "icon": "sprout", "unlocked": True},
    {"id": "b2", "name": "Seedling", "description": "10 packages dissolved.", "icon": "leaf", "unlocked": True},
    {"id": "b3", "name": "Sapling", "description": "25 packages dissolved.", "icon": "tree", "unlocked": False},
    {"id": "b4", "name": "Grove Keeper", "description": "100 packages dissolved.", "icon": "forest", "unlocked": False},
    {"id": "b5", "name": "Soil Scholar", "description": "Read every article.", "icon": "book", "unlocked": False},
    {"id": "b6", "name": "Streak Master", "description": "14-day streak.", "icon": "flame", "unlocked": False},
]

STATS = {
    "packages_dissolved": 13,
    "co2_saved_kg": 4.7,
    "water_saved_l": 82.5,
    "soil_enriched_g": 340.0,
    "streak_days": 4,
    "garden_level": 2,
    "garden_progress": 0.6,
}

PROFILE = {
    "name": "Amelia",
    "tagline": "Earth-first since 2025",
    "member_since": "March 2025",
    "total_points": 420,
    "rank": "Seedling",
}


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "NutriLoop API", "status": "ok"}


@api_router.get("/stats", response_model=ImpactStats)
async def get_stats():
    return ImpactStats(**STATS)


@api_router.get("/activities", response_model=List[Activity])
async def get_activities():
    return [Activity(**a) for a in ACTIVITIES]


@api_router.get("/articles", response_model=List[Article])
async def get_articles():
    return [Article(**a) for a in ARTICLES]


@api_router.get("/articles/{article_id}", response_model=Article)
async def get_article(article_id: str):
    for a in ARTICLES:
        if a["id"] == article_id:
            return Article(**a)
    raise HTTPException(status_code=404, detail="Article not found")


@api_router.get("/materials", response_model=List[Material])
async def get_materials():
    return [Material(**m) for m in MATERIALS]


@api_router.get("/materials/{material_id}", response_model=Material)
async def get_material(material_id: str):
    for m in MATERIALS:
        if m["id"] == material_id:
            return Material(**m)
    raise HTTPException(status_code=404, detail="Material not found")


@api_router.get("/challenges", response_model=List[Challenge])
async def get_challenges():
    return [Challenge(**c) for c in CHALLENGES]


@api_router.get("/badges", response_model=List[Badge])
async def get_badges():
    return [Badge(**b) for b in BADGES]


@api_router.get("/profile", response_model=Profile)
async def get_profile():
    return Profile(**PROFILE)


class DissolveLog(BaseModel):
    material_id: str
    method: Optional[str] = None


@api_router.post("/dissolve")
async def log_dissolve(payload: DissolveLog):
    STATS["packages_dissolved"] += 1
    STATS["co2_saved_kg"] = round(STATS["co2_saved_kg"] + 0.36, 2)
    STATS["water_saved_l"] = round(STATS["water_saved_l"] + 6.3, 2)
    STATS["soil_enriched_g"] = round(STATS["soil_enriched_g"] + 26.0, 2)
    STATS["garden_progress"] = min(1.0, STATS["garden_progress"] + 0.08)
    if STATS["garden_progress"] >= 1.0:
        STATS["garden_level"] += 1
        STATS["garden_progress"] = 0.05
    new_act = {
        "id": str(uuid.uuid4()),
        "title": "Package dissolved",
        "subtitle": f"Material • {payload.method or 'Soil'}",
        "impact_label": "+1 pkg",
        "icon": "leaf",
        "timestamp": datetime.now(timezone.utc).strftime("%b %d, %H:%M"),
    }
    ACTIVITIES.insert(0, new_act)
    return {"success": True, "stats": STATS, "activity": new_act}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
