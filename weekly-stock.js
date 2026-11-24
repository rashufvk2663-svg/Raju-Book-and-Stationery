
const RajuWeeklyStock = {

  async getStockList() {
    return await getAllRecords("products");
  },

  async saveWeeklyCount(counts) {
    if (!Array.isArray(counts) || counts.length === 0) {
      throw new Error("Stock count is empty");
    }

    const products = await getAllRecords("products");
    const results = [];

    for (const entry of counts) {
      const product = products.find(
        p => p.id === Number(entry.productId)
      );

      const physicalStock = Number(entry.physicalStock);

      if (
        !product ||
        !Number.isFinite(physicalStock) ||
        physicalStock < 0
      ) {
        throw new Error("Invalid stock count");
      }

      const previousStock = Number(product.stock || 0);
      const difference = previousStock - physicalStock;

      results.push({
        productId: product.id,
        productName: product.name,
        previousStock,
        physicalStock,
        difference,
        date: new Date().toISOString()
      });
    }

    for (const result of results) {
      const product = products.find(
        p => p.id === result.productId
      );

      product.stock = result.physicalStock;
      await saveRecord("products", product);
    }

    const report = {
      items: results,
      date: new Date().toISOString()
    };

    const reportId = await saveRecord("weeklyStock", report);

    return { reportId, items: results };
  },

  async history() {
    return await getAllRecords("weeklyStock");
  }
};

window.RajuWeeklyStock = RajuWeeklyStock;
