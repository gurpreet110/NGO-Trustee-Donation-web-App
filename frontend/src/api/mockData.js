// Mock data for the NGO donation platform.
// Swap these arrays for real axios calls later.

export const campaigns = [
  {
    id: "c1",
    title: "Clean Water for Rural Villages",
    shortDescription:
      "Bring safe drinking water to 12 villages in East Africa through solar-powered boreholes.",
    description:
      "Millions of people in rural East Africa lack access to clean drinking water. This campaign funds the installation of solar-powered boreholes in 12 villages, providing sustainable, clean water to over 30,000 residents. Each borehole serves an average of 2,500 people and requires minimal maintenance thanks to solar technology.",
    category: "Water",
    image:
      "https://images.pexels.com/photos/2837692/pexels-photo-2837692.jpeg?auto=compress&cs=tinysrgb&w=1200",
    goal: 7500000,
    raised: 4935000,
    status: "active",
    deadline: "2026-12-31",
    trusteeId: "t1",
  },
  {
    id: "c2",
    title: "Books for Every Child",
    shortDescription:
      "Stock 50 under-resourced schools with libraries of 1,000+ books each.",
    description:
      "Literacy is the foundation of opportunity. We partner with 50 schools in underserved communities to build fully-stocked libraries. Each school receives a curated collection of 1,000+ age-appropriate books, shelving, and reading corners designed to spark a lifelong love of learning.",
    category: "Education",
    image:
      "https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=1200",
    goal: 4000000,
    raised: 4075000,
    status: "completed",
    deadline: "2026-06-30",
    trusteeId: "t1",
  },
  {
    id: "c3",
    title: "Emergency Flood Relief",
    shortDescription:
      "Provide food, shelter, and medical supplies to families displaced by flooding.",
    description:
      "Severe flooding has displaced thousands of families. Your donation provides emergency food packs, temporary shelter materials, clean water filters, and essential medical supplies. We work with local partners on the ground to deliver aid within 48 hours of donation processing.",
    category: "Emergency",
    image:
      "https://images.pexels.com/photos/2699324/pexels-photo-2699324.jpeg?auto=compress&cs=tinysrgb&w=1200",
    goal: 12500000,
    raised: 7660000,
    status: "active",
    deadline: "2026-11-15",
    trusteeId: "t2",
  },
  {
    id: "c4",
    title: "Mobile Health Clinics",
    shortDescription:
      "Launch 5 mobile clinics bringing free healthcare to remote communities.",
    description:
      "Access to healthcare shouldn't depend on where you live. This campaign equips and deploys 5 mobile clinics that travel to remote communities, offering free check-ups, vaccinations, maternal care, and health education. Each clinic serves approximately 8,000 patients per year.",
    category: "Health",
    image:
      "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=1200",
    goal: 10000000,
    raised: 2125000,
    status: "active",
    deadline: "2027-03-01",
    trusteeId: "t2",
  },
  {
    id: "c5",
    title: "Trees for Tomorrow",
    shortDescription:
      "Plant 100,000 trees to combat deforestation and restore ecosystems.",
    description:
      "Deforestation threatens biodiversity and accelerates climate change. This campaign aims to plant 100,000 native trees across deforested regions. We work with local communities to plant and maintain trees, providing training in sustainable agroforestry and creating long-term green jobs.",
    category: "Environment",
    image:
      "https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg?auto=compress&cs=tinysrgb&w=1200",
    goal: 3000000,
    raised: 2645000,
    status: "active",
    deadline: "2027-01-31",
    trusteeId: "t3",
  },
  {
    id: "c6",
    title: "School Meals Program",
    shortDescription:
      "Provide daily nutritious meals to 5,000 students for an entire school year.",
    description:
      "Hunger is one of the biggest barriers to education. This campaign funds daily nutritious meals for 5,000 students across 20 schools for a full academic year. Well-fed children learn better, attend school more regularly, and have significantly improved health outcomes.",
    category: "Food",
    image:
      "https://images.pexels.com/photos/6646919/pexels-photo-6646919.jpeg?auto=compress&cs=tinysrgb&w=1200",
    goal: 6000000,
    raised: 3365000,
    status: "active",
    deadline: "2026-09-30",
    trusteeId: "t3",
  },
];

export const donations = [
  {
    id: "d1",
    userId: "u1",
    campaignId: "c1",
    campaignTitle: "Clean Water for Rural Villages",
    amount: 25000,
    date: "2026-10-15",
    status: "completed",
  },
  {
    id: "d2",
    userId: "u1",
    campaignId: "c3",
    campaignTitle: "Emergency Flood Relief",
    amount: 12500,
    date: "2026-10-10",
    status: "completed",
  },
  {
    id: "d3",
    userId: "u1",
    campaignId: "c6",
    campaignTitle: "School Meals Program",
    amount: 5000,
    date: "2026-10-01",
    status: "completed",
  },
  {
    id: "d4",
    userId: "u2",
    campaignId: "c2",
    campaignTitle: "Books for Every Child",
    amount: 50000,
    date: "2026-09-28",
    status: "completed",
  },
  {
    id: "d5",
    userId: "u2",
    campaignId: "c4",
    campaignTitle: "Mobile Health Clinics",
    amount: 15000,
    date: "2026-09-20",
    status: "completed",
  },
  {
    id: "d6",
    userId: "u2",
    campaignId: "c5",
    campaignTitle: "Trees for Tomorrow",
    amount: 2500,
    date: "2026-08-15",
    status: "completed",
  },
];

export const trustees = [
  {
    id: "t1",
    name: "Dr. Amara Okafor",
    role: "Education & Water Programs",
    bio: "Dr. Okafor has 18 years of experience in international development, overseeing water and education initiatives across 14 countries.",
    image:
      "https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "t2",
    name: "Marcus Chen",
    role: "Emergency Response Director",
    bio: "A former humanitarian logistics coordinator, Marcus has led emergency response operations in 9 disaster zones over the past decade.",
    image:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "t3",
    name: "Sofia Ramirez",
    role: "Health & Environment Lead",
    bio: "Sofia combines a medical background with environmental advocacy, designing programs that improve both community and planetary health.",
    image:
      "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

export const users = [
  {
    id: "u1",
    name: "Jane Donor",
    email: "jane@example.com",
    role: "donor",
    joinedDate: "2026-01-15",
    totalDonated: 42500,
  },
  {
    id: "u2",
    name: "Robert Wilson",
    email: "robert@example.com",
    role: "donor",
    joinedDate: "2026-02-20",
    totalDonated: 67500,
  },
  {
    id: "t1",
    name: "Dr. Amara Okafor",
    email: "amara@example.com",
    role: "trustee",
    joinedDate: "2025-06-01",
    totalDonated: 0,
  },
  {
    id: "t2",
    name: "Marcus Chen",
    email: "marcus@example.com",
    role: "trustee",
    joinedDate: "2025-06-01",
    totalDonated: 0,
  },
  {
    id: "admin1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    joinedDate: "2025-01-01",
    totalDonated: 0,
  },
];

// Mock contact messages submitted through the contact form.
export const contactMessages = [
  {
    id: "m1",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    message: "I'd like to partner with GiveHope for our corporate giving program. Can someone reach out?",
    date: "2026-10-20",
  },
  {
    id: "m2",
    name: "David Kim",
    email: "d.kim@email.com",
    message: "Is it possible to earmark my donation specifically for the water project overhead costs?",
    date: "2026-10-18",
  },
];

// Mock user accounts for login simulation.
export const accounts = [
  { email: "jane@example.com", password: "password", userId: "u1" },
  { email: "robert@example.com", password: "password", userId: "u2" },
  { email: "amara@example.com", password: "password", userId: "t1" },
  { email: "marcus@example.com", password: "password", userId: "t2" },
  { email: "admin@example.com", password: "password", userId: "admin1" },
];
