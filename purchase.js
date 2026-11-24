
const RajuPurchase = {

  async add(data) {
    const products = await getAllRecords("products");

    const product = products.find(
      p => p.id === Number(data.productId)
    );

    if (!product) {
      throw new Error("Product not found");
    }

    const quantity = Number(data.quantity);
    const totalCost = Number(data.totalCost);
    const extraCost = Number(data.extraCost) || 0;

    if (
      !Number.isFinite(quantity) || quantity <= 0 ||
      !Number.isFinite(totalCost) || totalCost < 0 ||
      !Number.isFinite(extraCost) || extraCost < 0
    ) {
      throw new Error("Invalid purchase details");
    }

    const finalCost = totalCost + extraCost;
    const unitCost = finalCost / quantity;

    product.stock = Number(product.stock || 0) + quantity;
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

  async history() {
    return await getAllRecords("purchases");
  }
};

window.RajuPurchase = RajuPurchase;
