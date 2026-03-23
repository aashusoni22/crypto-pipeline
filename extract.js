const axios = require("axios");

async function extractCryptoData() {
  console.log("Starting extraction from CoinGecko API...");

  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 20,
          page: 1,
          sparkline: false,
          price_change_percentage: "24h,7d",
        },
      },
    );

    const rawData = response.data;
    console.log(`✅ Successfully extracted ${rawData.length} coins from API`);
    console.log("Sample raw record:");
    console.log(JSON.stringify(rawData[0], null, 2));

    return rawData;
  } catch (error) {
    console.error("❌ Extraction failed:", error.message);
    throw error;
  }
}

module.exports = { extractCryptoData };
