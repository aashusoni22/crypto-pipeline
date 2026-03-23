# Crypto Data Pipeline 🚀

A fully automated ETL (Extract, Transform, Load) data pipeline that fetches
live cryptocurrency market data from a REST API and loads it into a PostgreSQL
database for analysis.

Built to demonstrate real-world data engineering concepts including API
integration, data transformation, database design, and SQL analysis.

---

## Pipeline Architecture

```
CoinGecko REST API → Extract → Transform → Load → PostgreSQL → SQL Analysis
```

---

## What It Does

- **Extracts** live data for top 20 cryptocurrencies from the CoinGecko API
- **Transforms** raw API response — cleans fields, renames columns, validates
  data quality, and adds pipeline metadata (fetched_at timestamp)
- **Loads** structured records into a PostgreSQL database with proper schema
- **Analyzes** data using advanced SQL — price trends, volatility, market
  dominance, and pipeline audit logs

---

## Tech Stack

| Layer      | Technology                                 |
| ---------- | ------------------------------------------ |
| Runtime    | Node.js 20                                 |
| API Client | Axios                                      |
| Database   | PostgreSQL 18                              |
| DB Driver  | node-postgres (pg)                         |
| Config     | dotenv                                     |
| Analysis   | SQL (CTEs, Window Functions, Aggregations) |

---

## Project Structure

```
crypto-pipeline/
├── extract.js      # Hits CoinGecko REST API, returns raw JSON
├── transform.js    # Cleans & reshapes raw data, validates quality
├── load.js         # Creates DB schema, inserts records via parameterized queries
├── pipeline.js     # Orchestrates full ETL run end-to-end
├── analyze.sql     # 8 SQL queries for market analysis
└── .env.example    # Environment variable template
```

---

## Database Schema

```sql
CREATE TABLE crypto_prices (
  id                   SERIAL PRIMARY KEY,
  coin_id              VARCHAR(50),
  symbol               VARCHAR(10),
  name                 VARCHAR(100),
  current_price_usd    NUMERIC(20, 8),
  market_cap_usd       NUMERIC(25, 2),
  market_cap_rank      INTEGER,
  total_volume_usd     NUMERIC(25, 2),
  high_24h_usd         NUMERIC(20, 8),
  low_24h_usd          NUMERIC(20, 8),
  price_change_24h_pct NUMERIC(10, 4),
  price_change_7d_pct  NUMERIC(10, 4),
  circulating_supply   NUMERIC(25, 2),
  max_supply           NUMERIC(25, 2),
  all_time_high_usd    NUMERIC(20, 8),
  ath_change_pct       NUMERIC(10, 4),
  fetched_at           TIMESTAMP,
  created_at           TIMESTAMP DEFAULT NOW()
);
```

---

## SQL Analysis Highlights

| Query                     | Purpose                                        |
| ------------------------- | ---------------------------------------------- |
| Latest snapshot           | Most recent price per coin using `DISTINCT ON` |
| Top gainers/losers        | 24h momentum using window ranking              |
| Price change between runs | Tracks data changes across pipeline executions |
| Market dominance          | % market cap share per coin                    |
| Volatility ranking        | 24h price range as % of low                    |
| Distance from ATH         | Identifies coins far from all time highs       |
| Pipeline audit log        | Every sync run logged with record counts       |

---

## Setup & Usage

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/crypto-pipeline.git
cd crypto-pipeline

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

### Run the pipeline

```bash
node pipeline.js
```

### Run SQL analysis

```bash
psql -U postgres -d crypto_pipeline -f analyze.sql
```

---

## Key Concepts Demonstrated

- **REST API integration** — authenticated requests, query parameters,
  error handling
- **ETL pipeline design** — separation of extract, transform, and load concerns
- **Data transformation** — field selection, type coercion, null handling,
  data quality validation
- **Database schema design** — appropriate data types, primary keys,
  timestamps
- **Parameterized SQL queries** — preventing SQL injection
- **Advanced SQL** — CTEs, window functions, aggregations, DISTINCT ON
- **Pipeline observability** — audit logging every run with metadata

---

## Sample Output

```
========================================
   CRYPTO PIPELINE STARTING...
========================================

Starting extraction from CoinGecko API...
✅ Successfully extracted 20 coins from API

Starting transformation...
✅ Transformation complete — 20 valid records ready to load

Starting load into PostgreSQL...
✅ Table ready
✅ Load complete — 20 records inserted, 0 errors

========================================
   PIPELINE COMPLETE ✅
========================================
```

---

## Author

**Aashutosh Soni**  
IT Support Specialist | CompTIA A+ Certified  
[LinkedIn](https://linkedin.com/in/aashusoni)
