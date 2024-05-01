import express from "express";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const usersMock = [
  { id: 1, username: "harry", displayName: "Harry" },
  { id: 2, username: "anton", displayName: "Anton" },
  { id: 3, username: "tommy", displayName: "Tommy" },
  { id: 4, username: "claude", displayName: "Claude" },
  { id: 5, username: "ron", displayName: "Ron" },
  { id: 6, username: "elias", displayName: "Elias" },
];

app.get("/", (req, res) => {
  res.status(200).send({ msg: "Ello" });
});

app.get("/api/users", (req, res) => {
  const {
    query: { filter, value },
  } = req;

  if (filter && value)
    return res.send(usersMock.filter((user) => user[filter].includes(value)));

  return res.send(usersMock);
});

app.post("/api/users", (req, res) => {
  const { body } = req;
  const newUser = { id: usersMock[usersMock.length - 1].id + 1, ...body };
  usersMock.push(newUser);

  return res.status(201).send(newUser);
});

app.get("/api/users/:id", (req, res) => {
  const parsedId = parseInt(req.params.id);

  if (isNaN(parsedId))
    return res.status(400).send({ msg: "Bad request. Invalid id" });

  const findUser = usersMock.find((user) => user.id === parsedId);
  if (!findUser) return res.sendStatus(404);

  return res.send(findUser);
});

app.get("/api/products", (req, res) => {
  res.send([
    { id: 1, name: "tshirt", price: 59.99 },
    { id: 2, name: "hoodie", price: 99.99 },
    { id: 3, name: "jumper", price: 79.99 },
  ]);
});

app.listen(PORT, () => {
  console.log("Listening on port 3000");
});
