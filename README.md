# BiteWise AI — Food Recommendation & Multi-Platform Price Comparison Platform

An end-to-end AI-powered food recommendation and multi-platform price comparison system built with the **MERN Stack (MongoDB, Express.js, React, Node.js)**, leveraging **Google Gemini AI API** and **Kaggle Indian Restaurant & Food Menu Datasets**.

---

## 🌟 Key Capabilities & 3 Intelligence Layers

### 1. AI Query Understanding Layer
- Accepts natural conversational queries (e.g. *"I want something spicy but light under ₹300"*, *"Cheesy Italian comfort meal around ₹400"*, *"High-protein salad bowl under ₹250"*).
- Converts unstructured natural language into structured search entities:
  - `flavors`: `['spicy', 'cheesy', 'tangy', ...]`
  - `health_preference`: `'light' | 'high_protein' | 'comfort' | 'healthy'`
  - `budget`: `max ₹300`
  - `cuisine`, `diet`, `meal`
- Powered by **Google Gemini API** (`gemini-1.5-flash`) with an intelligent local heuristic NLP parser fallback.

### 2. Spatial & Candidate Recommendation Engine
- **Kaggle Restaurant & Food Menu Dataset** loaded in **MongoDB** with real coordinates (Indiranagar, Koramangala, MG Road, HSR Layout, Church Street), authentic dishes, ratings, and price tiers.
- **Haversine Distance Filter**: Calculates precise spatial distance between the user GPS location and nearby kitchens.
- **Multi-Factor Scoring Formula**:
  $$\text{Score} = w_1 \cdot \text{PreferenceMatch} + w_2 \cdot \text{PriceSuitability} + w_3 \cdot \text{RatingQuality} + w_4 \cdot \text{Distance} + w_5 \cdot \text{Personalization} + w_6 \cdot \text{DeliveryTime}$$
- Automatically synthesizes transparent **"Why We Recommend It"** explanation checkmarks.

### 3. Multi-Platform Price Normalization & Savings Engine
- Calculates true **checkout payable prices** across **Swiggy**, **Zomato**, and **Direct Restaurant Ordering**:
  - **Menu Base Price**
  - **Platform Coupon / Discount** (e.g. `SWIGGYIT` 15% off, `ZOMATO50` 20% off, `DIRECT5`)
  - **Distance-based Delivery Fee**
  - **Packaging Charges**
  - **Taxes & Platform Fees**
- Highlights the **Lowest Price Platform**, exact **₹ Savings**, and **Best Overall Value**.

### 4. Feedback & Personalization Loop
- Tracks interactions (`liked`, `disliked`, `saved`, `ordered`, `rated`) in MongoDB.
- Dynamically learns user taste preferences (flavor affinities, favorite cuisines, budget tolerance) across preset personas (*Aarav*, *Priya*, *Rohan*, *New User*).

### 5. Restaurant Partner Portal
- Allows restaurant owners to update dish prices or toggle availability (in-stock / sold-out), showing real-time feedback loop integration.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **MongoDB**: Supports MongoDB Atlas, local MongoDB (`mongodb://127.0.0.1:27017`), or runs with the built-in in-memory fallback.

---

### Running the Backend

```bash
cd backend
npm install
node server.js
```
*Backend runs on `http://localhost:5001`.*

---

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`.*

---

### Running Automated Test Suite

```bash
cd backend
node test_api.js
```

---

## 📁 Project Structure

```
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection & in-memory fallback
│   ├── data/
│   │   ├── kaggle_dataset.js      # Kaggle Indian restaurant & menu dataset
│   │   └── seed.js                # Database seeding script
│   ├── models/
│   │   ├── Restaurant.js          # Restaurant schema & platform pricing config
│   │   ├── FoodItem.js            # Food item schema, tags & platform prices
│   │   ├── User.js                # User profile & learned preferences
│   │   └── Interaction.js         # Feedback interaction event logs
│   ├── services/
│   │   ├── aiService.js           # Gemini AI API call & heuristic query parser
│   │   ├── searchService.js       # Haversine distance & candidate retrieval
│   │   ├── recommendationService.js # Multi-factor scoring & reasoning engine
│   │   ├── priceService.js        # Multi-platform cost breakdown & savings
│   │   └── userService.js         # Personalization feedback learning loop
│   ├── routes/
│   │   ├── recommendRoutes.js     # POST /api/recommend
│   │   ├── restaurantRoutes.js    # GET /api/restaurants, PUT items
│   │   └── userRoutes.js          # GET /api/users/personas, POST events
│   └── server.js                  # Express application entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx         # Location, Persona, and Drawer toggles
│   │   │   ├── SearchBar.jsx      # Conversational search bar & voice simulation
│   │   │   ├── HeroRecommendation.jsx # #1 Flagship recommendation card
│   │   │   ├── PriceComparisonTable.jsx # Swiggy vs Zomato vs Direct matrix
│   │   │   ├── RecommendationsList.jsx # Ranked alternative dishes grid
│   │   │   ├── PipelineInspectorModal.jsx # Visual AI 3-layer inspector
│   │   │   ├── UserProfileModal.jsx   # Learned taste profile viewer
│   │   │   ├── RestaurantPartnerModal.jsx # Restaurant menu & price updater
│   │   │   └── SavedItemsDrawer.jsx   # Bookmarked dishes drawer
│   │   ├── services/
│   │   │   └── api.js             # API communication layer
│   │   ├── App.jsx                # Main dashboard UI & state management
│   │   └── main.jsx               # React entry point
│   └── vite.config.js             # Vite proxy configuration
```

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/recommend` | Natural language recommendation & price comparison pipeline |
| `GET` | `/api/restaurants` | List restaurants and active menus |
| `PUT` | `/api/restaurants/:id/items/:itemId` | Partner portal endpoint to update dish price/availability |
| `GET` | `/api/users/personas` | List available user personas |
| `GET` | `/api/users/:id/profile` | Fetch user learned taste profile and activity history |
| `POST` | `/api/users/:id/events` | Record feedback events (`liked`, `disliked`, `saved`, `order_clicked`) |
| `GET` | `/api/health` | Backend status and active AI engine mode |