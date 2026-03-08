const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/todos", async (req, res) => {
  const result = await pool.query("SELECT * FROM todos");
  res.json(result.rows);
});

app.post("/todos", async (req, res) => {
  const { task } = req.body;
  const result = await pool.query(
    "INSERT INTO todos(task) VALUES($1) RETURNING *",
    [task]
  );
  res.json(result.rows[0]);
});

app.delete("/todos/:id", async (req, res) => {
  const id = req.params.id;
  await pool.query("DELETE FROM todos WHERE id=$1", [id]);
  res.json({ message: "Deleted" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
