
const RajuAlerts = {

  async getLowStockItems() {
    const products = await getAllRecords("products");

    return products.filter(product => {
      const stock = Number(product.stock || 0);
      const minimum = Number(product.minStock || 0);

      return stock <= minimum;
    });
  },

  async getAlertCount() {
    const items = await this.getLowStockItems();
    return items.length;
  },

  async hasLowStock() {
    return (await this.getAlertCount()) > 0;
  }
};

window.RajuAlerts = RajuAlerts;
