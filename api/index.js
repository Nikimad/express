import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import express from "express";
import uniqueId from "lodash/uniqueId";

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, "db.json");

const adapter = new JSONFile(filePath);
const defaultData = { posts: [] };
const db = new Low(adapter, defaultData);

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Demo server");
});

app.get("/boards", async (req, res) => {
  await db.read();
  res.send(db.data.boards);
});

app.post("/boards", async ({ body }) => {
  await db.read();
  const id = uniqueId();
  db.data.boards.items[id] = { id, ...body };
  db.data.boards.ids = [id, ...db.data.boards.ids];
  await db.write();
});

app.listen(port);
