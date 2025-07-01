/**
 * Script to seed the problems collection with data from problems_old.json.
 * Usage: node scripts/seedProblems.js
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Use the existing Problem model definition
const Problem = require('../src/models/problem');

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not found in environment');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('MongoDB connected.');

  const count = await Problem.countDocuments();
  if (count > 0) {
    console.log(`Problems collection already has ${count} documents. Aborting seeding.`);
    await mongoose.disconnect();
    return;
  }

  const filePath = path.resolve(__dirname, '..', 'problems_old.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
  console.log(`Loaded ${data.length} problems from JSON file. Inserting...`);

  await Problem.insertMany(data, { ordered: false });
  console.log('Seeding completed!');

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
