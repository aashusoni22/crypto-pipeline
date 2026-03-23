const { extractCryptoData } = require("./extract");
const { transformCryptoData } = require("./transform");
const { loadCryptoData } = require("./load");

async function runPipeline() {
  console.log("========================================");
  console.log("   CRYPTO PIPELINE STARTING...");
  console.log("========================================\n");

  try {
    // Phase 1: Extract
    const rawData = await extractCryptoData();
    console.log("");

    // Phase 2: Transform
    const cleanData = transformCryptoData(rawData);
    console.log("");

    // Phase 3: Load
    await loadCryptoData(cleanData);
    console.log("");

    console.log("========================================");
    console.log("   PIPELINE COMPLETE ✅");
    console.log("========================================");
  } catch (error) {
    console.error("Pipeline failed:", error.message);
    process.exit(1);
  }
}

runPipeline();
