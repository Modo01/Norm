const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MSSQL Configuration
const sqlConfig = {
  user: "dolgoon",
  password: "0000",
  server: "DESKTOP-6C5I2IB",
  database: "norm",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Database Connection Pool
let pool;
(async () => {
  try {
    pool = await sql.connect(sqlConfig);
    console.log("Connected to MSSQL");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
})();

// Fetch data from the norm table
app.get("/norms", async (req, res) => {
  try {
    const query = "SELECT * FROM [dolgoon].[norm] WHERE visibility = 1";
    const result = await pool.request().query(query);
    res.status(200).json({ data: result.recordset });
  } catch (error) {
    console.error("Error fetching data from norm:", error);
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
});

// Fetch data from other tables
const fetchData = (tableName) => async (req, res) => {
  try {
    const query = `SELECT * FROM [dolgoon].[${tableName}]`;
    const result = await pool.request().query(query);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(`Error fetching data from ${tableName}:`, error);
    res.status(500).json({
      message: `Error fetching data from ${tableName}`,
      error: error.message,
    });
  }
};

app.get("/normTypes", fetchData("normType"));
app.get("/categories", fetchData("category"));
app.get("/subCategories", fetchData("subCategory"));
app.get("/smallCategories", fetchData("smallCategory"));
app.get("/repairTypes", fetchData("repairType"));
app.get("/groups", fetchData("group"));
app.get("/additions", fetchData("addition"));
app.get("/units", fetchData("unit"));
app.get("/scopes", fetchData("branch"));
app.get("/rules", fetchData("rule"));
app.get("/products", fetchData("product"));
app.get("/addedProducts", fetchData("addedProduct"));
app.get("/norms/:id", fetchData("norm"));
app.get("/services", fetchData("service"));
app.get("/accesses", fetchData("access"));

// Add norms with transactions
app.post("/addNorms", async (req, res) => {
  const {
    normType,
    category,
    subCategory,
    smallCategory,
    repairType,
    group,
    addition,
    unit,
    quantity,
    rule,
    scope,
    addedProducts,
    statusDate, // Date received from the frontend
    netPrice, // Total net price received from the frontend
    status, // Status received from the frontend
  } = req.body;

  let transaction;
  try {
    transaction = new sql.Transaction(pool);
    await transaction.begin();

    // Insert norm data
    const request = transaction.request();
    request
      .input("normType", sql.NVarChar, normType)
      .input("category", sql.NVarChar, category)
      .input("subCategory", sql.NVarChar, subCategory)
      .input("smallCategory", sql.NVarChar, smallCategory || null)
      .input("repairType", sql.NVarChar, repairType)
      .input("group", sql.NVarChar, group)
      .input("addition", sql.NVarChar, addition)
      .input("unit", sql.NVarChar, unit)
      .input("quantity", sql.Int, quantity)
      .input("rule", sql.NVarChar, rule)
      .input("statusDate", sql.DateTime, statusDate) // Insert statusDate
      .input("netPrice", sql.Float, netPrice) // Insert netPrice
      .input("status", sql.NVarChar, status) // Insert status
      .input("visibility", sql.Int, 1); // Default visibility to 1

    const insertNormQuery = `
      INSERT INTO [dolgoon].[norm] (
        normType, category, subCategory, smallCategory, repairType, [group],
        addition, unit, quantity, [rule], statusDate, netPrice, status, visibility
      ) OUTPUT INSERTED.Id AS normId
      VALUES (
        @normType, @category, @subCategory, @smallCategory, @repairType,
        @group, @addition, @unit, @quantity, @rule, @statusDate, @netPrice, @status, @visibility
      );
    `;
    const normResult = await request.query(insertNormQuery);
    const normId = normResult.recordset[0].normId;

    // Insert related scopes
    for (const branchName of scope) {
      const branchRequest = transaction.request();
      branchRequest.input("branchName", sql.NVarChar, branchName);
      const branchResult = await branchRequest.query(`
        SELECT Id FROM [dolgoon].[branch] WHERE branch = @branchName
      `);

      if (branchResult.recordset.length === 0) {
        throw new Error(`Branch not found: ${branchName}`);
      }

      const branchId = branchResult.recordset[0].Id;

      const scopeInsertRequest = transaction.request();
      scopeInsertRequest
        .input("branchId", sql.Int, branchId)
        .input("normId", sql.Int, normId);

      await scopeInsertRequest.query(`
        INSERT INTO [dolgoon].[scope] (branchId, normId)
        VALUES (@branchId, @normId);
      `);
    }

    // Insert added products
    for (const product of addedProducts) {
      const addedProductRequest = transaction.request();
      addedProductRequest
        .input("normId", sql.Int, normId)
        .input("picNum", sql.Int, product.picNum)
        .input("newPrice", sql.Float, product.newPrice)
        .input("newNetPrice", sql.Float, product.newNetPrice)
        .input("unit", sql.NVarChar, product.unit)
        .input("productUnit", sql.NVarChar, product.formUnit) // Use formUnit for productUnit
        .input("quantity", sql.Int, product.quantity)
        .input("code", sql.Int, product.code)
        .input("price", sql.Float, product.price)
        .input("netPrice", sql.Float, product.netPrice)
        .input("productName", sql.NVarChar, product.k4);

      await addedProductRequest.query(`
        INSERT INTO [dolgoon].[addedProduct] (
          normId, picNum, newPrice, newNetPrice, unit, productUnit, quantity, code, price, netPrice, productName
        ) VALUES (
          @normId, @picNum, @newPrice, @newNetPrice, @unit, @productUnit, @quantity, @code, @price, @netPrice, @productName
        );
      `);
    }

    // Commit transaction
    await transaction.commit();
    res.status(200).send("Data saved successfully");
  } catch (error) {
    console.error("Error saving data:", error);

    if (transaction) {
      await transaction.rollback();
    }

    res
      .status(500)
      .json({ message: "Error saving data", error: error.message });
  }
});

// Helper function to save logs
const saveLog = async (transaction, normId, status, user, userAction) => {
  try {
    await transaction
      .request()
      .input("normId", sql.Int, normId)
      .input("status", sql.NVarChar, status || null)
      .input("actionDate", sql.DateTime, new Date())
      .input("user", sql.NVarChar, user)
      .input("userAction", sql.NVarChar, userAction).query(`
          INSERT INTO [dolgoon].[log] (normId, status, actionDate, [user], userAction)
          VALUES (@normId, @status, @actionDate, @user, @userAction)
        `);
  } catch (logError) {
    console.error("Error saving log entry:", logError.message);
    throw new Error("Failed to save log entry.");
  }
};

// Mark norm as removed (visibility = 0)
app.put("/norms/:id", async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;

  // if (!id || isNaN(Number(id))) {
  //   return res.status(400).json({ message: "Invalid norm ID." });
  // }
  // if (!user) {
  //   return res
  //     .status(400)
  //     .json({ message: "User is required for this action." });
  // }

  let transaction;
  try {
    transaction = new sql.Transaction(pool);
    await transaction.begin();

    await transaction
      .request()
      .input("id", sql.Int, id)
      .input("visibility", sql.Int, 0).query(`
        UPDATE [dolgoon].[norm]
        SET visibility = @visibility
        WHERE Id = @id
      `);

    await saveLog(transaction, id, null, user, "Устгах");

    await transaction.commit();
    res.status(200).send("Norm removed successfully.");
  } catch (error) {
    console.error("Error removing norm:", error);
    if (transaction) await transaction.rollback();
    res
      .status(500)
      .json({ message: "Error removing norm.", error: error.message });
  }
});

app.delete("/addedProducts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM [dolgoon].[addedProduct] WHERE Id = @id");
    res.status(200).send("Product deleted successfully");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
});

// Validate norm
app.put("/norms/:id/validate", async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: "Invalid norm ID." });
  }

  let transaction;
  try {
    transaction = new sql.Transaction(pool);
    await transaction.begin();

    await transaction
      .request()
      .input("id", sql.Int, id)
      .input("status", sql.NVarChar, "Баталгаажсан").query(`
        UPDATE [dolgoon].[norm]
        SET status = @status
        WHERE Id = @id
      `);

    await saveLog(transaction, id, "Баталгаажсан", user, "Баталгаажуулах");

    await transaction.commit();
    res.status(200).send("Norm validated successfully.");
  } catch (error) {
    console.error("Error validating norm:", error);
    if (transaction) await transaction.rollback();
    res
      .status(500)
      .json({ message: "Error validating norm.", error: error.message });
  }
});

// Cancel norm
app.put("/norms/:id/cancel", async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: "Invalid norm ID." });
  }

  let transaction;
  try {
    transaction = new sql.Transaction(pool);
    await transaction.begin();

    await transaction
      .request()
      .input("id", sql.Int, id)
      .input("status", sql.NVarChar, "Цуцлагдсан").query(`
        UPDATE [dolgoon].[norm]
        SET status = @status
        WHERE Id = @id
      `);

    await saveLog(transaction, id, "Цуцлагдсан", user, "Цуцлах");

    await transaction.commit();
    res.status(200).send("Norm canceled successfully.");
  } catch (error) {
    console.error("Error canceling norm:", error);
    if (transaction) await transaction.rollback();
    res
      .status(500)
      .json({ message: "Error canceling norm.", error: error.message });
  }
});

//Edit norm product
app.put("/updateAddedProducts/:id", async (req, res) => {
  const { id } = req.params; // Norm ID
  const { user, products } = req.body; // Extract user and products from the body

  if (!id || !products || products.length === 0) {
    return res.status(400).json({
      message: "Invalid request. Please provide a valid norm ID and products.",
    });
  }

  let transaction;
  try {
    transaction = new sql.Transaction(pool);
    await transaction.begin();

    // Update each product
    for (const product of products) {
      const request = transaction.request();
      await request
        .input("id", sql.Int, product.Id)
        .input("newPrice", sql.Float, product.newPrice)
        .input("newNetPrice", sql.Float, product.newNetPrice)
        .input("netPrice", sql.Float, product.netPrice)
        .input("quantity", sql.Int, product.quantity).query(`
          UPDATE [dolgoon].[addedProduct]
          SET newPrice = @newPrice,
              newNetPrice = @newNetPrice,
              netPrice = @netPrice,
              quantity = @quantity
          WHERE Id = @id
        `);
    }

    // Calculate total netPrice for the norm
    const totalNetPrice = products.reduce(
      (sum, product) => sum + product.newNetPrice,
      0
    );

    // Update norm's total net price after updating products
    const normRequest = transaction.request();
    await normRequest
      .input("id", sql.Int, id)
      .input("netPrice", sql.Float, totalNetPrice) // Updated total net price
      .input("status", sql.NVarChar, "Засварлагдсан") // Set status to 'Засварлагдсан'
      .query(`
         UPDATE [dolgoon].[norm]
         SET status = @status,
             netPrice = @netPrice
         WHERE Id = @id
      `);

    // Save log entry
    await saveLog(transaction, id, "Засварлагдсан", user, "Засварлах");

    // Commit the transaction
    await transaction.commit();
    res.status(200).send("Products and norm updated successfully.");
  } catch (error) {
    console.error("Error updating products and norm:", error);

    if (transaction) {
      await transaction.rollback();
    }

    res.status(500).json({
      message: "Error updating products and norm.",
      error: error.message,
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://172.30.30.14:${PORT}`);
});
