import { LowSync } from "lowdb";
import { LocalStorage } from 'lowdb/browser'
import express from "express";
import uniqueId from "lodash/uniqueId.js";

localStorage.setItem("db");

const defaultData = {
  boards: {
    items: {},
    ids: [],
  },
};

const db = new LowSync(new LocalStorage("db"), defaultData);

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Demo server");
});

app.get("/boards", async (req, res) => {
  db.read();
  res.send(db.data.boards);
});

app.listen(port);
