function transformCryptoData(rawData) {
  console.log("Starting transformation...");

  try {
    const transformed = rawData.map((coin) => {
      return {
        coin_id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        current_price_usd: coin.current_price,
        market_cap_usd: coin.market_cap,
        market_cap_rank: coin.market_cap_rank,
        total_volume_usd: coin.total_volume,
        high_24h_usd: coin.high_24h,
        low_24h_usd: coin.low_24h,
        price_change_24h_pct:
          parseFloat(coin.price_change_percentage_24h?.toFixed(4)) || 0,
        price_change_7d_pct:
          parseFloat(coin.price_change_percentage_7d_in_currency?.toFixed(4)) ||
          0,
        circulating_supply: coin.circulating_supply,
        max_supply: coin.max_supply || null,
        all_time_high_usd: coin.ath,
        ath_change_pct: parseFloat(coin.ath_change_percentage?.toFixed(4)) || 0,
        fetched_at: new Date().toISOString(),
      };
    });

    // Data quality check
    const invalid = transformed.filter(
      (c) => !c.coin_id || !c.current_price_usd,
    );
    if (invalid.length > 0) {
      console.warn(
        `⚠️  Found ${invalid.length} invalid records — skipping them`,
      );
    }
    const valid = transformed.filter((c) => c.coin_id && c.current_price_usd);

    console.log(
      `✅ Transformation complete — ${valid.length} valid records ready to load`,
    );
    console.log("Sample transformed record:");
    console.log(JSON.stringify(valid[0], null, 2));

    return valid;
  } catch (error) {
    console.error("❌ Transformation failed:", error.message);
    throw error;
  }
}

module.exports = { transformCryptoData };
