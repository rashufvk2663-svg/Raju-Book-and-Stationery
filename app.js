
const RajuApp = {
  ready: false,

  async init() {
    try {
      await openDatabase();
      this.ready = true;
      console.log("Raju Book and Stationery App Ready");
      return true;
    } catch (error) {
      console.error("Database Error:", error);
      return false;
    }
  },

  async getProducts() {
    return await getAllRecords("products");
  },

  async addProduct(data) {
    if (!data.name || Number(data.openingStock) < 0) {
      throw new Error("Product details are invalid");
    }

    const product = {
      name: data.name.trim(),
      category: data.category || "General",
      itemCode: data.itemCode || "",
      sellingPrice: Number(data.sellingPrice) || 0,
      purchaseCost: Number(data.purchaseCost) || 0,
      stock: Number(data.openingStock) || 0,
      minStock: Number(data.minStock) || 0,
      unit: data.unit || "Piece",
      createdAt: new Date().toISOString()
    };

    return await saveRecord("products", product);
  },

  async addPurchase(data) {
    const products = await this.getProducts();
    const product = products.find(p => p.id === Number(data.productId));

    if (!product) throw new Error("Product not found");

    const quantity = Number(data.quantity);
    const totalCost = Number(data.totalCost);
    const extraCost = Number(data.extraCost) || 0;

    if (quantity <= 0 || totalCost < 0 || extraCost < 0) {
      throw new Error("Invalid purchase details");
    }

    const finalCost = totalCost + extraCost;
    const unitCost = finalCost / quantity;

    product.stock += quantity;
    product.purchaseCost = unitCost;

    await saveRecord("products", product);

    return await saveRecord("purchases", {
      productId: product.id,
      productName: product.name,
      quantity,
      totalCost,
      extraCost,
      finalCost,
      unitCost,
      date: new Date().toISOString()
    });
  },

  async getLowStock() {
    const products = await this.getProducts();

    return products.filter(
      p => p.stock <= p.minStock
    );
  },

  async getPurchases() {
    return await getAllRecords("purchases");
  },

  async getSales() {
    return await getAllRecords("sales");
  },

  async getWeeklyStock() {
    return await getAllRecords("weeklyStock");
  }
};

window.RajuApp = RajuApp;

