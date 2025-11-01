const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3030;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Read JSON data
const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));

// Connect to MongoDB
mongoose.connect("mongodb://mongo_db:27017/", { dbName: 'dealershipsDB' });

// Import models
const Reviews = require('./review');
const Dealerships = require('./dealership');

// Initialize DB with seed data
(async () => {
  try {
    await Reviews.deleteMany({});
    await Reviews.insertMany(reviews_data['reviews']);
    await Dealerships.deleteMany({});
    await Dealerships.insertMany(dealerships_data['dealerships']);
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
})();

// ✅ Home route
app.get('/', (req, res) => {
  res.send("Welcome to the Mongoose API");
});


// ==========================
// 🚘 DEALERSHIP ENDPOINTS
// ==========================

// ✅ Fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    const dealers = await Dealerships.find();
    res.json(dealers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching dealerships' });
  }
});

// ✅ Fetch dealerships by state
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const stateParam = req.params.state;
    const dealers = await Dealerships.find({ state: stateParam });
    res.json(dealers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching dealerships by state' });
  }
});

// ✅ Fetch dealer by ID
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const dealerId = parseInt(req.params.id);
    const dealer = await Dealerships.findOne({ id: dealerId });
    if (!dealer) {
      return res.status(404).json({ error: 'Dealer not found' });
    }
    res.json(dealer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching dealer by ID' });
  }
});


// ==========================
// 📝 REVIEW ENDPOINTS
// ==========================

// ✅ Fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const reviews = await Reviews.find();
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

// ✅ Fetch reviews by a particular dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const reviews = await Reviews.find({ dealership: req.params.id });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching dealer reviews' });
  }
});

// ✅ Insert a new review
app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
  try {
    const data = JSON.parse(req.body);
    const lastReview = await Reviews.findOne().sort({ id: -1 });
    const new_id = lastReview ? lastReview.id + 1 : 1;

    const newReview = new Reviews({
      id: new_id,
      name: data['name'],
      dealership: data['dealership'],
      review: data['review'],
      purchase: data['purchase'],
      purchase_date: data['purchase_date'],
      car_make: data['car_make'],
      car_model: data['car_model'],
      car_year: data['car_year'],
    });

    const savedReview = await newReview.save();
    res.json(savedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// ✅ Start the server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
