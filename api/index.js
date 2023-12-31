import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import express from "express";
import uniqueId from "lodash/uniqueId.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, "db.json");

const adapter = new JSONFile(filePath);
const defaultData = {
  boards: {
    items: {},
    ids: [],
  },
};
const db = new Low(adapter, defaultData);

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Demo server");
});

app.get("/boards", async (req, res) => {
  await db.read();
  res.send(db.data.boards);
});

app.post("/boards", async (req, res) => {
  await db.read();
  const {items, ids} = db.data;
  const id = uniqueId();
  const entity = { id, ...req.body };
  items[id] = entity;
  ids = [id, ...ids];
  await db.write();
  res.json(entity);
});

app.listen(port);
