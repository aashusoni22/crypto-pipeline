require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function createTableIfNotExists() {
  const query = `
    CREATE TABLE IF NOT EXISTS crypto_prices (
      id                   SERIAL PRIMARY KEY,
      coin_id              VARCHAR(50)    NOT NULL,
      symbol               VARCHAR(10)    NOT NULL,
      name                 VARCHAR(100)   NOT NULL,
      current_price_usd    NUMERIC(20, 8) NOT NULL,
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
      fetched_at           TIMESTAMP      NOT NULL,
      created_at           TIMESTAMP      DEFAULT NOW()
    );
  `;
  await pool.query(query);
  console.log("✅ Table ready");
}

async function loadCryptoData(transformedData) {
  console.log("Starting load into PostgreSQL...");

  await createTableIfNotExists();

  let successCount = 0;
  let errorCount = 0;

  for (const coin of transformedData) {
    try {
      await pool.query(
        `INSERT INTO crypto_prices (
          coin_id, symbol, name, current_price_usd, market_cap_usd,
          market_cap_rank, total_volume_usd, high_24h_usd, low_24h_usd,
          price_change_24h_pct, price_change_7d_pct, circulating_supply,
          max_supply, all_time_high_usd, ath_change_pct, fetched_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
        [
          coin.coin_id,
          coin.symbol,
          coin.name,
          coin.current_price_usd,
          coin.market_cap_usd,
          coin.market_cap_rank,
          coin.total_volume_usd,
          coin.high_24h_usd,
          coin.low_24h_usd,
          coin.price_change_24h_pct,
          coin.price_change_7d_pct,
          coin.circulating_supply,
          coin.max_supply,
          coin.all_time_high_usd,
          coin.ath_change_pct,
          coin.fetched_at,
        ],
      );
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to insert ${coin.coin_id}:`, error.message);
      errorCount++;
    }
  }

  console.log(
    `✅ Load complete — ${successCount} records inserted, ${errorCount} errors`,
  );
  await pool.end();
}

module.exports = { loadCryptoData };
