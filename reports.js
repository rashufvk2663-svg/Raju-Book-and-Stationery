
const RajuReports = {

  async getSummary(period = "all") {
    const sales = await getAllRecords("sales");
    const purchases = await getAllRecords("purchases");

    const now = new Date();

    function isInPeriod(dateValue) {
      const date = new Date(dateValue);

      if (Number.isNaN(date.getTime())) return false;

      if (period === "all") return true;

      if (period === "today") {
        return date.toDateString() === now.toDateString();
      }

      if (period === "month") {
        return date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear();
      }

      if (period === "week") {
        const start = new Date(now);
        start.setDate(now.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        return date >= start && date <= now;
      }

      return false;
    }

    const filteredSales = sales.filter(
      sale => isInPeriod(sale.date)
    );

    const filteredPurchases = purchases.filter(
      purchase => isInPeriod(purchase.date)
    );

    const totalSales = filteredSales.reduce(
      (sum, sale) => sum + Number(sale.grandTotal || 0), 0
    );

    const totalProfit = filteredSales.reduce(
      (sum, sale) => sum + Number(sale.totalProfit || 0), 0
    );

    const totalPurchase = filteredPurchases.reduce(
      (sum, purchase) => sum + Number(purchase.finalCost || 0), 0
    );

    const soldItems = {};

    filteredSales.forEach(sale => {
      (sale.items || []).forEach(item => {
        soldItems[item.productName] =
          (soldItems[item.productName] || 0) +
          Number(item.quantity || 0);
      });
    });

    const bestSelling = Object.entries(soldItems)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity);

    return {
      period,
      totalSales,
      totalPurchase,
      totalProfit,
      totalBills: filteredSales.length,
      bestSelling
    };
  },

  async getStockReport() {
    const products = await getAllRecords("products");

    return products.map(product => ({
      name: product.name,
      stock: Number(product.stock || 0),
      purchaseCost: Number(product.purchaseCost || 0),
      stockValue:
        Number(product.stock || 0) *
        Number(product.purchaseCost || 0)
    }));
  }
};

window.RajuReports = RajuReports;
