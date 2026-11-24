
const RajuSales = {

  async createBill(items) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Bill is empty");
    }

    const products = await getAllRecords("products");
    const billItems = [];
    let grandTotal = 0;
    let totalProfit = 0;

    for (const item of items) {
      const product = products.find(
        p => p.id === Number(item.productId)
      );

      const quantity = Number(item.quantity);
      const price = Number(item.salePrice);

      if (!product || quantity <= 0 || price < 0) {
        throw new Error("Invalid sale details");
      }

      if (product.stock < quantity) {
        throw new Error("Insufficient stock: " + product.name);
      }

      const amount = quantity * price;
      const cost = quantity * Number(product.purchaseCost || 0);
      const profit = amount - cost;

      billItems.push({
        productId: product.id,
        productName: product.name,
        quantity,
        salePrice: price,
        amount,
        cost,
        profit
      });

      grandTotal += amount;
      totalProfit += profit;
    }

    for (const item of billItems) {
      const product = products.find(
        p => p.id === item.productId
      );

      product.stock -= item.quantity;
      await saveRecord("products", product);
    }

    const bill = {
      items: billItems,
      grandTotal,
      totalProfit,
      date: new Date().toISOString()
    };

    const billId = await saveRecord("sales", bill);

    await saveRecord("transactions", {
      type: "sale",
      billId,
      amount: grandTotal,
      profit: totalProfit,
      date: bill.date
    });

    return {
      billId,
      grandTotal,
      totalProfit,
      items: billItems
    };
  },

  async getSalesHistory() {
    return await getAllRecords("sales");
  }
};

window.RajuSales = RajuSales;
