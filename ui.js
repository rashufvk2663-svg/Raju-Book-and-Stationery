
window.openPage = async function(page) {
  const area = document.getElementById("page");
  if (!area) return;

  if (page === "stock") {
    await showStockPage(area);
  } else if (page === "purchase") {
    area.innerHTML = "<h3>Purchase Management</h3><p>अगले चरण में तैयार होगा।</p>";
  } else if (page === "salespage") {
    area.innerHTML = "<h3>Sales Management</h3><p>अगले चरण में तैयार होगा।</p>";
  } else if (page === "reports") {
    area.innerHTML = "<h3>Business Reports</h3><p>अगले चरण में तैयार होगा।</p>";
  } else if (page === "alerts") {
    area.innerHTML = "<h3>Stock Alerts</h3><p>अगले चरण में तैयार होगा।</p>";
  } else {
    area.innerHTML = "<h3>App Settings</h3><p>अगले चरण में तैयार होगा।</p>";
  }

  area.scrollIntoView({ behavior: "smooth" });
};

async function showStockPage(area) {
  const products = await RajuApp.getProducts();

  area.innerHTML = `
    <div class="card">
      <h3>➕ नया सामान जोड़ें</h3>

      <form id="productForm">
        <p>सामान का नाम *</p>
        <input name="name" required placeholder="जैसे: कॉपी">

        <p>कैटेगरी</p>
        <input name="category" placeholder="जैसे: स्टेशनरी">

        <p>आइटम कोड</p>
        <input name="itemCode" placeholder="वैकल्पिक">

        <p>बिक्री मूल्य (₹)</p>
        <input name="sellingPrice" type="number" min="0" step="0.01" value="0">

        <p>प्रति पीस खरीद लागत (₹)</p>
        <input name="purchaseCost" type="number" min="0" step="0.01" value="0">

        <p>शुरुआती स्टॉक *</p>
        <input name="openingStock" type="number" min="0" required value="0">

        <p>न्यूनतम स्टॉक अलर्ट</p>
        <input name="minStock" type="number" min="0" value="5">

        <p>यूनिट</p>
        <select name="unit">
          <option value="Piece">पीस</option>
          <option value="Packet">पैकेट</option>
          <option value="Box">बॉक्स</option>
          <option value="Dozen">दर्जन</option>
          <option value="Bundle">बंडल</option>
        </select>

        <br><br>
        <button type="submit">सामान सेव करें</button>
      </form>
    </div>

    <div class="card">
      <h3>📦 सामान की सूची (${products.length})</h3>
      <div id="productList"></div>
    </div>
  `;

  document.getElementById("productForm").onsubmit =
    async function(event) {
      event.preventDefault();

      const form = new FormData(event.target);
      const data = Object.fromEntries(form.entries());

      try {
        await RajuApp.addProduct(data);
        alert("सामान सफलतापूर्वक सेव हो गया।");
        await showStockPage(area);
        await updateDashboard();
      } catch (error) {
        alert("त्रुटि: " + error.message);
      }
    };

  const list = document.getElementById("productList");

  if (products.length === 0) {
    list.innerHTML = "<p>अभी कोई सामान नहीं जोड़ा गया है।</p>";
  } else {
    list.innerHTML = products.map(product => `
      <div style="border-bottom:1px solid #ddd;padding:12px 0">
        <b>${escapeHTML(product.name)}</b>
        <p>स्टॉक: ${Number(product.stock || 0)} ${escapeHTML(product.unit || "Piece")}</p>
        <p>खरीद लागत: ₹${Number(product.purchaseCost || 0).toFixed(2)}</p>
        <p>बिक्री मूल्य: ₹${Number(product.sellingPrice || 0).toFixed(2)}</p>
      </div>
    `).join("");
  }
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

async function updateDashboard() {
  const products = await RajuApp.getProducts();

  const totalStock = products.reduce(
    (sum, item) => sum + Number(item.stock || 0), 0
  );

  const productCount = document.getElementById("products");
  const stockCount = document.getElementById("stock");

  if (productCount) productCount.textContent = products.length;
  if (stockCount) stockCount.textContent = totalStock;

  if (window.RajuAlerts) {
    const alerts = await RajuAlerts.getAlertCount();
    const alertButton = document.querySelector(
      'button[onclick*="alerts"]'
    );
    if (alertButton) {
      alertButton.textContent = "🔔 Stock Alerts (" + alerts + ")";
    }
  }
}

document.addEventListener("DOMContentLoaded", updateDashboard);
