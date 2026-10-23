import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { connectDb, disconnectDb } from "../config/db.js";
import { User } from "../models/User.js";
import { Trustee } from "../models/Trustee.js";
import { Campaign } from "../models/Campaign.js";
import { Donation } from "../models/Donation.js";
import { ContactMessage } from "../models/ContactMessage.js";
import { Counter } from "../models/Counter.js";
import { nextReceiptNumber } from "../services/receiptService.js";
import { parseDateOnly } from "../utils/dates.js";

if (!env.MONGODB_URI) {
  console.error("Missing required environment variable: MONGODB_URI");
  process.exit(1);
}

const password = env.SEED_PASSWORD;

const IMAGES = {
  amara:
    "https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=600",
  marcus:
    "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600",
  sofia:
    "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=600",
};

async function seed() {
  await connectDb();

  await Promise.all([
    User.deleteMany({}),
    Trustee.deleteMany({}),
    Campaign.deleteMany({}),
    Donation.deleteMany({}),
    ContactMessage.deleteMany({}),
    Counter.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash(password, 10);

  const [jane, robert, amara, marcus, admin] = await User.create([
    {
      name: "Jane Donor",
      email: "jane@example.com",
      passwordHash,
      role: "donor",
      totalDonated: 42500,
      createdAt: parseDateOnly("2026-01-15"),
    },
    {
      name: "Robert Wilson",
      email: "robert@example.com",
      passwordHash,
      role: "donor",
      totalDonated: 67500,
      createdAt: parseDateOnly("2026-02-20"),
    },
    {
      name: "Dr. Amara Okafor",
      email: "amara@example.com",
      passwordHash,
      role: "trustee",
      totalDonated: 0,
      createdAt: parseDateOnly("2025-06-01"),
    },
    {
      name: "Marcus Chen",
      email: "marcus@example.com",
      passwordHash,
      role: "trustee",
      totalDonated: 0,
      createdAt: parseDateOnly("2025-06-01"),
    },
    {
      name: "Admin User",
      email: "admin@example.com",
      passwordHash,
      role: "admin",
      totalDonated: 0,
      createdAt: parseDateOnly("2025-01-01"),
    },
  ]);

  const [amaraProfile, marcusProfile, sofiaProfile] = await Trustee.create([
    {
      name: "Dr. Amara Okafor",
      role: "Education & Water Programs",
      bio: "Dr. Okafor has 18 years of experience in international development, overseeing water and education initiatives across 14 countries.",
      image: IMAGES.amara,
      userId: amara._id,
      createdAt: parseDateOnly("2025-06-01"),
    },
    {
      name: "Marcus Chen",
      role: "Emergency Response Director",
      bio: "A former humanitarian logistics coordinator, Marcus has led emergency response operations in 9 disaster zones over the past decade.",
      image: IMAGES.marcus,
      userId: marcus._id,
      createdAt: parseDateOnly("2025-06-01"),
    },
    {
      name: "Sofia Ramirez",
      role: "Health & Environment Lead",
      bio: "Sofia combines a medical background with environmental advocacy, designing programs that improve both community and planetary health.",
      image: IMAGES.sofia,
      createdAt: parseDateOnly("2025-07-01"),
    },
  ]);

  const campaigns = await Campaign.create([
    {
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
      deadline: parseDateOnly("2026-12-31"),
      trustee: amaraProfile._id,
      createdAt: parseDateOnly("2026-01-10"),
    },
    {
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
      deadline: parseDateOnly("2026-06-30"),
      trustee: amaraProfile._id,
      createdAt: parseDateOnly("2026-02-10"),
    },
    {
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
      deadline: parseDateOnly("2026-11-15"),
      trustee: marcusProfile._id,
      createdAt: parseDateOnly("2026-03-10"),
    },
    {
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
      deadline: parseDateOnly("2027-03-01"),
      trustee: marcusProfile._id,
      createdAt: parseDateOnly("2026-04-10"),
    },
    {
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
      deadline: parseDateOnly("2027-01-31"),
      trustee: sofiaProfile._id,
      createdAt: parseDateOnly("2026-05-10"),
    },
    {
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
      deadline: parseDateOnly("2026-09-30"),
      trustee: sofiaProfile._id,
      createdAt: parseDateOnly("2026-06-10"),
    },
  ]);

  const donationSpecs = [
    { user: jane, campaign: campaigns[0], amount: 25000, date: "2026-10-15" },
    { user: jane, campaign: campaigns[2], amount: 12500, date: "2026-10-10" },
    { user: jane, campaign: campaigns[5], amount: 5000, date: "2026-10-01" },
    { user: robert, campaign: campaigns[1], amount: 50000, date: "2026-09-28" },
    { user: robert, campaign: campaigns[3], amount: 15000, date: "2026-09-20" },
    { user: robert, campaign: campaigns[4], amount: 2500, date: "2026-08-15" },
  ];

  for (const spec of donationSpecs) {
    const createdAt = parseDateOnly(spec.date);
    const receiptNumber = await nextReceiptNumber(createdAt);
    await Donation.create({
      user: spec.user._id,
      campaign: spec.campaign._id,
      campaignTitle: spec.campaign.title,
      amount: spec.amount,
      status: "completed",
      receiptNumber,
      paymentMethod: "simulated",
      transactionId: `seed_${receiptNumber}`,
      createdAt,
    });
  }

  console.log("GiveHope seed complete.");
  console.log("Seeded login emails (password = SEED_PASSWORD):");
  console.log("  jane@example.com     (donor)");
  console.log("  robert@example.com   (donor)");
  console.log("  amara@example.com    (trustee)");
  console.log("  marcus@example.com   (trustee)");
  console.log("  admin@example.com    (admin)");

  await disconnectDb();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
