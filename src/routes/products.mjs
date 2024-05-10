import { Router } from "express";

const router = Router();

router.get("/api/products", (req, res) => {
  res.send([
    { id: 1, name: "tshirt", price: 59.99 },
    { id: 2, name: "hoodie", price: 99.99 },
    { id: 3, name: "jumper", price: 79.99 },
  ]);
});

export default router;
