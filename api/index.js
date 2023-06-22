import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'
import express from "express";
import uniqueId from "lodash/uniqueId.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, "db.json");

const adapter = new JSONFileSync(filePath);
const defaultData = {
  boards: {
    items: {},
    ids: [],
  },
};
const db = new LowSync(adapter, defaultData);

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Demo server");
});

app.get("/boards", (req, res) => {
  db.read();
  res.send(db.data.boards);
});

app.post("/boards", async (req, res) => {
  db.read();
  const id = uniqueId();
  const entity = { id, ...req.body };
  db.data.boards.items[id] = entity;
  db.data.boards.ids = [id, ...db.data.boards.ids];
  db.write();
  res.json(entity);
});

app.listen(port);
