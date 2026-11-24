
const RajuBackup = {

  async exportData() {
    const stores = [
      "products",
      "purchases",
      "sales",
      "weeklyStock",
      "settings",
      "transactions"
    ];

    const backup = {
      app: "Raju Book and Stationery",
      version: 1,
      createdAt: new Date().toISOString(),
      data: {}
    };

    for (const store of stores) {
      backup.data[store] = await getAllRecords(store);
    }

    const file = new Blob(
      [JSON.stringify(backup, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Raju-Stationery-Backup.json";
    link.click();

    URL.revokeObjectURL(url);
  },

  async importData(backup) {
    if (
      backup?.app !== "Raju Book and Stationery" ||
      !backup.data ||
      !Array.isArray(backup.data.products)
    ) {
      throw new Error("Invalid backup file");
    }

    const stores = [
      "products",
      "purchases",
      "sales",
      "weeklyStock",
      "settings",
      "transactions"
    ];

    for (const store of stores) {
      const records = backup.data[store];

      if (!Array.isArray(records)) {
        throw new Error("Backup data is incomplete");
      }
    }

    for (const store of stores) {
      const records = backup.data[store];
      const transaction = db.transaction(store, "readwrite");
      const objectStore = transaction.objectStore(store);

      objectStore.clear();

      for (const record of records) {
        objectStore.put(record);
      }

      await new Promise((resolve, reject) => {
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
      });
    }

    return true;
  }
};

window.RajuBackup = RajuBackup;
