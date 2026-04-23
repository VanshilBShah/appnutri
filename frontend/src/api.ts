// Static mock — no backend required. All data lives here.

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

// ── Static data ──────────────────────────────────────────────────────────────

const STATS: Stats = {
  packages_dissolved: 13,
  co2_saved_kg: 4.7,
  water_saved_l: 82.5,
  soil_enriched_g: 340.0,
  streak_days: 4,
  garden_level: 2,
  garden_progress: 0.6,
};

const ACTIVITIES: Activity[] = [
  { id: 'act1', title: 'Mailer dissolved', subtitle: 'Garden soil • Backyard', impact_label: '+2 pkg', icon: 'leaf', timestamp: 'Today, 9:12 AM' },
  { id: 'act2', title: 'Film wrap dissolved', subtitle: 'Kitchen • Warm water', impact_label: '+1 pkg', icon: 'water', timestamp: 'Yesterday, 7:30 PM' },
  { id: 'act3', title: 'Article read', subtitle: 'Soil Health 101', impact_label: '+10 pts', icon: 'book', timestamp: 'Yesterday, 2:15 PM' },
  { id: 'act4', title: 'Challenge completed', subtitle: '5-day dissolve streak', impact_label: '+50 pts', icon: 'star', timestamp: '2 days ago' },
];

const ARTICLES: Article[] = [
  {
    id: 'a1',
    title: 'The Science of Seaweed Packaging',
    category: 'Material Science',
    read_time: '4 min read',
    image: 'https://images.unsplash.com/photo-1681178519331-09cdb1e3ff19?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzV8MHwxfHNlYXJjaHwyfHxncmVlbiUyMGxlYWYlMjBtaW5pbWFsfGVufDB8fHx8MTc3Njc4ODE5M3ww&ixlib=rb-4.1.0&q=85',
    excerpt: 'How brown seaweed becomes packaging that dissolves into plant food.',
    body: "Seaweed alginate forms the structural backbone of NutriLoop's regenerative packaging. When combined with cassava starch and rice husk fibers, it creates a film that is water-resistant during use yet fully dissolvable after. When the package meets soil or water, alginate breaks down in 4-8 weeks, releasing potassium, calcium, and trace minerals that nourish microbial life.\n\nUnlike compostable plastics that require industrial facilities, NutriLoop returns value to the earth wherever it lands - a backyard garden, a park, or the ocean.",
  },
  {
    id: 'a2',
    title: "What 'Circular' Really Means",
    category: 'Circular Design',
    read_time: '3 min read',
    image: 'https://images.pexels.com/photos/13567645/pexels-photo-13567645.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    excerpt: 'Moving beyond recycling to packaging that actively gives back.',
    body: "The linear economy takes, makes, and wastes. The circular economy aims to eliminate waste - but most 'circular' systems still downgrade materials with every loop.\n\nNutriLoop proposes a third path: regenerative design. Our packaging doesn't just avoid harm; it deposits nutrients that rebuild topsoil, which has been depleted globally by 33% since industrial farming began. Every mailer you dissolve is a small act of repair.",
  },
  {
    id: 'a3',
    title: 'Soil Health 101',
    category: 'Earth Science',
    read_time: '5 min read',
    image: 'https://images.pexels.com/photos/7944395/pexels-photo-7944395.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    excerpt: 'Why the top six inches of earth matter more than you think.',
    body: 'Healthy soil contains more microorganisms in a teaspoon than there are humans on Earth. These microbes fix nitrogen, cycle carbon, and defend plants from disease - all for free.\n\nNutriLoop packaging contains prebiotic polysaccharides that feed soil microbiome diversity. A single dissolved mailer can measurably boost microbial activity within a 10cm radius for 3-6 months.',
  },
  {
    id: 'a4',
    title: 'From Ocean to Earth',
    category: 'Sustainability',
    read_time: '3 min read',
    image: 'https://images.unsplash.com/photo-1601662528567-526cd06f6582?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxwYXBlciUyMHRleHR1cmUlMjBiYWNrZ3JvdW5kfGVufDB8fHx8MTc3Njc4ODE5OHww&ixlib=rb-4.1.0&q=85',
    excerpt: 'Our feedstock is farmed - not extracted - and sequesters carbon while it grows.',
    body: 'Seaweed is one of the fastest growing organisms on the planet, requiring no land, no freshwater, and no fertilizer. Every hectare of seaweed farm sequesters up to 20 tons of CO2 annually and creates habitat for marine life.\n\nBy sourcing from community-operated kelp farms along coastal regions, NutriLoop supports small fishing economies while turning a waste problem into a regenerative cycle.',
  },
];

const MATERIALS: Material[] = [
  {
    id: 'm1',
    name: 'NutriLoop Mailer',
    category: 'Shipping',
    dissolve_time: '4-6 weeks in soil',
    method: 'Soil burial',
    nutrients: ['Potassium', 'Calcium', 'Trace minerals'],
    instructions: [
      'Tear the mailer into 4-6 pieces.',
      'Bury 10-15 cm deep in garden soil or a potted plant.',
      'Water lightly. Full dissolution in 4-6 weeks.',
      'No composting facility required.',
    ],
    image: 'https://images.pexels.com/photos/10793124/pexels-photo-10793124.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  },
  {
    id: 'm2',
    name: 'Flexible Film Wrap',
    category: 'Food',
    dissolve_time: 'Instant in warm water',
    method: 'Warm water dissolution',
    nutrients: ['Magnesium', 'Iron'],
    instructions: [
      'Submerge in warm water (40C+).',
      'Film dissolves in 30-60 seconds.',
      'Pour residual water on plants - it\'s plant food.',
    ],
    image: 'https://images.pexels.com/photos/7944395/pexels-photo-7944395.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  },
  {
    id: 'm3',
    name: 'Protective Insert',
    category: 'Shipping',
    dissolve_time: '2-3 weeks in compost',
    method: 'Composting or soil',
    nutrients: ['Silica', 'Potassium'],
    instructions: [
      'Break into smaller pieces.',
      'Add to home compost bin or bury in soil.',
      'Fully breaks down in 2-3 weeks.',
    ],
    image: 'https://images.unsplash.com/photo-1681178519331-09cdb1e3ff19?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzV8MHwxfHNlYXJjaHwyfHxncmVlbiUyMGxlYWYlMjBtaW5pbWFsfGVufDB8fHx8MTc3Njc4ODE5M3ww&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 'm4',
    name: 'Cup Lid',
    category: 'Food',
    dissolve_time: '1 week in soil',
    method: 'Soil or backyard',
    nutrients: ['Calcium', 'Phosphorus'],
    instructions: [
      'Rinse off any residue.',
      'Place in soil, garden, or green waste.',
      'Dissolves fully in about 7 days.',
    ],
    image: 'https://images.pexels.com/photos/13567645/pexels-photo-13567645.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  },
];

const CHALLENGES: Challenge[] = [
  { id: 'c1', title: '7-Day Dissolve Streak', description: 'Dissolve a package every day for a week.', reward_points: 100, progress: 0.57, target: 7, current: 4, icon: 'flame', completed: false },
  { id: 'c2', title: 'Soil Scientist', description: 'Read all 4 articles in the Education Hub.', reward_points: 40, progress: 0.75, target: 4, current: 3, icon: 'book', completed: false },
  { id: 'c3', title: 'First Sprout', description: 'Dissolve your first NutriLoop package.', reward_points: 20, progress: 1.0, target: 1, current: 1, icon: 'sprout', completed: true },
  { id: 'c4', title: 'Ocean Guardian', description: 'Dissolve 25 packages total.', reward_points: 200, progress: 0.52, target: 25, current: 13, icon: 'waves', completed: false },
];

const BADGES: Badge[] = [
  { id: 'b1', name: 'First Sprout', description: 'Your first dissolved package.', icon: 'sprout', unlocked: true },
  { id: 'b2', name: 'Seedling', description: '10 packages dissolved.', icon: 'leaf', unlocked: true },
  { id: 'b3', name: 'Sapling', description: '25 packages dissolved.', icon: 'tree', unlocked: false },
  { id: 'b4', name: 'Grove Keeper', description: '100 packages dissolved.', icon: 'forest', unlocked: false },
  { id: 'b5', name: 'Soil Scholar', description: 'Read every article.', icon: 'book', unlocked: false },
  { id: 'b6', name: 'Streak Master', description: '14-day streak.', icon: 'flame', unlocked: false },
];

const PROFILE: Profile = {
  name: 'Vans',
  tagline: 'Earth-first since 2025',
  member_since: 'March 2025',
  total_points: 420,
  rank: 'Seedling',
};

// ── API surface (same shape as before, now returns static data) ──────────────

export const api = {
  stats: async () => ({ ...STATS }),
  activities: async () => [...ACTIVITIES],
  articles: async () => [...ARTICLES],
  article: async (id: string) => {
    const a = ARTICLES.find(x => x.id === id);
    if (!a) throw new Error('Not found');
    return a;
  },
  materials: async () => [...MATERIALS],
  material: async (id: string) => {
    const m = MATERIALS.find(x => x.id === id);
    if (!m) throw new Error('Not found');
    return m;
  },
  challenges: async () => [...CHALLENGES],
  badges: async () => [...BADGES],
  profile: async () => ({ ...PROFILE }),
  dissolve: async (material_id: string, _method?: string) => {
    const activity: Activity = {
      id: `act-${Date.now()}`,
      title: 'Package dissolved',
      subtitle: MATERIALS.find(m => m.id === material_id)?.name ?? 'Package',
      impact_label: '+1 pkg',
      icon: 'leaf',
      timestamp: 'Just now',
    };
    return { success: true, stats: { ...STATS, packages_dissolved: STATS.packages_dissolved + 1 }, activity };
  },
};
