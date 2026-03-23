-- ================================================
-- CRYPTO PIPELINE: SQL ANALYSIS
-- Author: Aashutosh Soni
-- Description: Analysis queries on live crypto data
-- ================================================


-- ================================================
-- QUERY 1: Latest snapshot of all coins
-- Purpose: Get the most recent price for every coin
-- ================================================
SELECT DISTINCT ON (coin_id)
  coin_id,
  symbol,
  name,
  current_price_usd,
  market_cap_rank,
  price_change_24h_pct,
  price_change_7d_pct,
  fetched_at
FROM crypto_prices
ORDER BY coin_id, fetched_at DESC;


-- ================================================
-- QUERY 2: Top 5 biggest gainers in last 24h
-- Purpose: Find coins with highest positive momentum
-- ================================================
SELECT DISTINCT ON (coin_id)
  symbol,
  name,
  current_price_usd,
  price_change_24h_pct
FROM crypto_prices
ORDER BY coin_id, fetched_at DESC, price_change_24h_pct DESC
LIMIT 5;


-- ================================================
-- QUERY 3: Top 5 biggest losers in last 24h
-- Purpose: Spot coins under selling pressure
-- ================================================
SELECT DISTINCT ON (coin_id)
  symbol,
  name,
  current_price_usd,
  price_change_24h_pct
FROM crypto_prices
ORDER BY coin_id, fetched_at DESC, price_change_24h_pct ASC
LIMIT 5;


-- ================================================
-- QUERY 4: Price change between pipeline runs
-- Purpose: Detect price movement between our fetches
-- ================================================
WITH ranked AS (
  SELECT
    coin_id,
    symbol,
    current_price_usd,
    fetched_at,
    ROW_NUMBER() OVER (PARTITION BY coin_id ORDER BY fetched_at DESC) AS run_number
  FROM crypto_prices
)
SELECT
  r1.symbol,
  r1.current_price_usd                              AS latest_price,
  r2.current_price_usd                              AS previous_price,
  ROUND(r1.current_price_usd - r2.current_price_usd, 4)   AS price_diff,
  ROUND(
    ((r1.current_price_usd - r2.current_price_usd) / r2.current_price_usd) * 100
  , 4)                                              AS pct_change_between_runs
FROM ranked r1
JOIN ranked r2
  ON r1.coin_id = r2.coin_id
  AND r1.run_number = 1
  AND r2.run_number = 2
ORDER BY ABS(r1.current_price_usd - r2.current_price_usd) DESC;


-- ================================================
-- QUERY 5: Market dominance breakdown
-- Purpose: Which coins control the most market cap?
-- ================================================
WITH latest AS (
  SELECT DISTINCT ON (coin_id)
    symbol,
    name,
    market_cap_usd
  FROM crypto_prices
  ORDER BY coin_id, fetched_at DESC
),
total AS (
  SELECT SUM(market_cap_usd) AS total_market_cap FROM latest
)
SELECT
  l.symbol,
  l.name,
  l.market_cap_usd,
  ROUND((l.market_cap_usd / t.total_market_cap) * 100, 2) AS dominance_pct
FROM latest l, total t
ORDER BY dominance_pct DESC;


-- ================================================
-- QUERY 6: Volatility ranking
-- Purpose: Which coins swing the most? High risk/reward
-- ================================================
SELECT DISTINCT ON (coin_id)
  symbol,
  name,
  high_24h_usd,
  low_24h_usd,
  ROUND(high_24h_usd - low_24h_usd, 4)                          AS price_range,
  ROUND(((high_24h_usd - low_24h_usd) / low_24h_usd) * 100, 2) AS volatility_pct
FROM crypto_prices
ORDER BY coin_id, fetched_at DESC, volatility_pct DESC
LIMIT 10;


-- ================================================
-- QUERY 7: Coins far from all time high
-- Purpose: Find potentially undervalued coins
-- ================================================
SELECT DISTINCT ON (coin_id)
  symbol,
  name,
  current_price_usd,
  all_time_high_usd,
  ath_change_pct
FROM crypto_prices
ORDER BY coin_id, fetched_at DESC, ath_change_pct ASC
LIMIT 10;


-- ================================================
-- QUERY 8: Data pipeline audit log
-- Purpose: Track every time our pipeline ran
-- ================================================
SELECT
  DATE_TRUNC('second', fetched_at) AS pipeline_run_time,
  COUNT(*)                         AS records_loaded,
  MIN(market_cap_rank)             AS top_rank_fetched,
  MAX(market_cap_rank)             AS bottom_rank_fetched,
  ROUND(AVG(current_price_usd), 2) AS avg_price_snapshot
FROM crypto_prices
GROUP BY DATE_TRUNC('second', fetched_at)
ORDER BY pipeline_run_time DESC;