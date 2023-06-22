import { Low } from "lowdb";
import { LocalStorage } from 'lowdb/browser'
import express from "express";
import uniqueId from "lodash/uniqueId.js";

const defaultData = {
  boards: {
    items: {},
    ids: [],
  },
};
const db = new Low(new LocalStorage("db"), defaultData);

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
  const id = uniqueId();
  const entity = { id, ...req.body };
  db.data.boards.items[id] = entity;
  db.data.boards.ids = [id, ...db.data.boards.ids];
  await db.write();
  res.json(entity);
});

app.listen(port);
