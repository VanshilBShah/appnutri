import { API_URL } from './theme';

const base = `${API_URL}/api`;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export type Stats = {
  packages_dissolved: number;
  co2_saved_kg: number;
  water_saved_l: number;
  soil_enriched_g: number;
  streak_days: number;
  garden_level: number;
  garden_progress: number;
};

export type Activity = {
  id: string;
  title: string;
  subtitle: string;
  impact_label: string;
  icon: string;
  timestamp: string;
};

export type Article = {
  id: string;
  title: string;
  category: string;
  read_time: string;
  image: string;
  excerpt: string;
  body: string;
};

export type Material = {
  id: string;
  name: string;
  category: string;
  dissolve_time: string;
  method: string;
  nutrients: string[];
  instructions: string[];
  image: string;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  reward_points: number;
  progress: number;
  target: number;
  current: number;
  icon: string;
  completed: boolean;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
};

export type Profile = {
  name: string;
  tagline: string;
  member_since: string;
  total_points: number;
  rank: string;
};

export const api = {
  stats: () => request<Stats>('/stats'),
  activities: () => request<Activity[]>('/activities'),
  articles: () => request<Article[]>('/articles'),
  article: (id: string) => request<Article>(`/articles/${id}`),
  materials: () => request<Material[]>('/materials'),
  material: (id: string) => request<Material>(`/materials/${id}`),
  challenges: () => request<Challenge[]>('/challenges'),
  badges: () => request<Badge[]>('/badges'),
  profile: () => request<Profile>('/profile'),
  dissolve: (material_id: string, method?: string) =>
    request<{ success: boolean; stats: Stats; activity: Activity }>('/dissolve', {
      method: 'POST',
      body: JSON.stringify({ material_id, method }),
    }),
};
