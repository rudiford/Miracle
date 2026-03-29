import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { users, posts, prayers, loves, comments, connections, messages, blocks, reports } from '../shared/schema';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

const seedUsers = [
  { id: 'seed-user-001', firstName: 'Maria', lastName: 'Gonzalez', email: 'maria.gonzalez@example.com', city: 'San Antonio', state: 'TX', country: 'US', gender: 'F' as const, age: 34 },
  { id: 'seed-user-002', firstName: 'James', lastName: 'Okafor', email: 'james.okafor@example.com', city: 'Atlanta', state: 'GA', country: 'US', gender: 'M' as const, age: 41 },
  { id: 'seed-user-003', firstName: 'Grace', lastName: 'Kim', email: 'grace.kim@example.com', city: 'Seattle', state: 'WA', country: 'US', gender: 'F' as const, age: 27 },
  { id: 'seed-user-004', firstName: 'David', lastName: 'Mensah', email: 'david.mensah@example.com', city: 'Houston', state: 'TX', country: 'US', gender: 'M' as const, age: 38 },
  { id: 'seed-user-005', firstName: 'Sarah', lastName: 'Thompson', email: 'sarah.thompson@example.com', city: 'Nashville', state: 'TN', country: 'US', gender: 'F' as const, age: 45 },
  { id: 'seed-user-006', firstName: 'Emmanuel', lastName: 'Adeyemi', email: 'emmanuel.adeyemi@example.com', city: 'Lagos', state: '', country: 'NG', gender: 'M' as const, age: 29 },
  { id: 'seed-user-007', firstName: 'Ruth', lastName: 'Nakamura', email: 'ruth.nakamura@example.com', city: 'Honolulu', state: 'HI', country: 'US', gender: 'F' as const, age: 52 },
  { id: 'seed-user-008', firstName: 'Carlos', lastName: 'Rivera', email: 'carlos.rivera@example.com', city: 'Miami', state: 'FL', country: 'US', gender: 'M' as const, age: 36 },
  { id: 'seed-user-009', firstName: 'Abigail', lastName: 'Owusu', email: 'abigail.owusu@example.com', city: 'Accra', state: '', country: 'GH', gender: 'F' as const, age: 31 },
  { id: 'seed-user-010', firstName: 'Michael', lastName: 'Bennett', email: 'michael.bennett@example.com', city: 'Dallas', state: 'TX', country: 'US', gender: 'M' as const, age: 44 },
];

const seedPosts = [
  {
    userId: 'seed-user-001',
    content: "Three years ago I was diagnosed with stage 3 ovarian cancer. The doctors gave me a 30% chance of survival. My church prayed over me every single week. I went back for my scan last month — completely cancer free. The oncologist said he had never seen anything like it. God is still in the miracle business. 🙏",
    location: 'San Antonio, TX',
    latitude: '29.4241',
    longitude: '-98.4936',
    prayerCount: 47,
    loveCount: 83,
    commentCount: 12,
  },
  {
    userId: 'seed-user-002',
    content: "My son was in a car accident last year. The car was totaled — hit by a truck at 60mph. He walked away without a single scratch. The police officer on scene said he'd never seen anyone survive a crash like that. We know who kept him safe that night. Thank you Jesus.",
    location: 'Atlanta, GA',
    latitude: '33.7490',
    longitude: '-84.3880',
    prayerCount: 62,
    loveCount: 104,
    commentCount: 19,
  },
  {
    userId: 'seed-user-003',
    content: "I had been struggling with severe depression for 5 years. Medications weren't working. I remember one night just crying out to God — truly surrendering everything. Something shifted that night. Not instantly, but over the following weeks I felt peace I had never felt before. I've been medication-free for 8 months and genuinely joyful. Only God.",
    location: 'Seattle, WA',
    latitude: '47.6062',
    longitude: '-122.3321',
    prayerCount: 38,
    loveCount: 71,
    commentCount: 15,
  },
  {
    userId: 'seed-user-004',
    content: "Lost my job during COVID and had $12 in my account with rent due in 3 days. I prayed and then felt prompted to check my mail. There was an envelope — a check from a class action settlement I had completely forgotten about. Exact amount I needed. God knows exactly what we need before we even ask.",
    location: 'Houston, TX',
    latitude: '29.7604',
    longitude: '-95.3698',
    prayerCount: 55,
    loveCount: 92,
    commentCount: 21,
  },
  {
    userId: 'seed-user-005',
    content: "My husband and I tried to have children for 11 years. 4 miscarriages. We had given up. A visiting pastor prayed over us at a conference and said 'your season of waiting is over.' Nine months later, our daughter was born. She just turned 2. We named her Grace because that's exactly what she is.",
    location: 'Nashville, TN',
    latitude: '36.1627',
    longitude: '-86.7816',
    prayerCount: 89,
    loveCount: 156,
    commentCount: 34,
  },
  {
    userId: 'seed-user-006',
    content: "I was a drug addict for 12 years. I had tried rehab 4 times and failed. One night at rock bottom I walked into a church I had never been to before. The pastor preached a message that felt like it was written specifically for my life. I gave my life to Christ that night. That was 7 years ago. Never relapsed once. Jesus set me free.",
    location: 'Lagos, Nigeria',
    latitude: '6.5244',
    longitude: '3.3792',
    prayerCount: 73,
    loveCount: 128,
    commentCount: 28,
  },
  {
    userId: 'seed-user-007',
    content: "My mother was told she had 2 weeks to live. Kidney failure. Our whole family flew in to say goodbye. We gathered around her bed and prayed for hours. Her numbers started improving that same night. Two weeks later she was discharged from the hospital. She celebrated her 80th birthday last month.",
    location: 'Honolulu, HI',
    latitude: '21.3069',
    longitude: '-157.8583',
    prayerCount: 91,
    loveCount: 167,
    commentCount: 41,
  },
  {
    userId: 'seed-user-008',
    content: "I was completely blind in my right eye after a work accident. Doctors said the nerve was permanently damaged. My pastor anointed my eyes with oil and prayed. Three days later I woke up and could see light. Within a week my vision was fully restored. My ophthalmologist literally said 'I don't have a medical explanation for this.'",
    location: 'Miami, FL',
    latitude: '25.7617',
    longitude: '-80.1918',
    prayerCount: 84,
    loveCount: 142,
    commentCount: 37,
  },
  {
    userId: 'seed-user-009',
    content: "I was about to sign divorce papers after 15 years of marriage. We had completely fallen apart. A friend convinced us to try one more thing — a marriage retreat at a Christian camp. That weekend God completely transformed both of our hearts. We renewed our vows on our 20th anniversary last year. He restores what the enemy tries to destroy.",
    location: 'Accra, Ghana',
    latitude: '5.6037',
    longitude: '-0.1870',
    prayerCount: 66,
    loveCount: 118,
    commentCount: 25,
  },
  {
    userId: 'seed-user-010',
    content: "My business was failing and I was $200,000 in debt. I committed to tithing even when I couldn't afford it. Over the next 18 months doors opened that made no natural sense — a contract came in from a client I had never contacted, then another, then another. The debt is completely paid. Malachi 3:10 is real.",
    location: 'Dallas, TX',
    latitude: '32.7767',
    longitude: '-96.7970',
    prayerCount: 58,
    loveCount: 99,
    commentCount: 22,
  },
  {
    userId: 'seed-user-001',
    content: "Small miracle today — I had been searching for my grandmother's Bible for 2 years since she passed. It had her handwritten notes in the margins. Found it today in a box I had already checked three times. Some things only God can explain. 💛",
    location: 'San Antonio, TX',
    latitude: '29.4241',
    longitude: '-98.4936',
    prayerCount: 23,
    loveCount: 44,
    commentCount: 8,
  },
  {
    userId: 'seed-user-003',
    content: "Praying for everyone on this platform who is in a waiting season. I was there for years. His timing is perfect even when it doesn't feel like it. Don't give up. What He promised, He will fulfill. 🙏",
    location: 'Seattle, WA',
    latitude: '47.6062',
    longitude: '-122.3321',
    prayerCount: 44,
    loveCount: 87,
    commentCount: 16,
  },
];

async function seed() {
  console.log('🌱 Starting seed...');

  // Clear all tables in correct order
  console.log('Clearing existing data...');
  await db.delete(reports);
  await db.delete(blocks);
  await db.delete(loves);
  await db.delete(prayers);
  await db.delete(comments);
  await db.delete(messages);
  await db.delete(connections);
  await db.delete(posts);
  await db.delete(users);
  console.log('✓ All data cleared');

  // Insert seed users
  console.log('Creating seed users...');
  await db.insert(users).values(seedUsers);
  console.log(`✓ Created ${seedUsers.length} users`);

  // Insert seed posts
  console.log('Creating seed posts...');
  await db.insert(posts).values(seedPosts);
  console.log(`✓ Created ${seedPosts.length} posts`);

  console.log('\n✅ Seed complete! Database is ready for new users.');
  await client.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
