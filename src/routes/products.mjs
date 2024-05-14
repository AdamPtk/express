import { Router } from "express";

const router = Router();

router.get("/api/products", (req, res) => {
  console.log(req.cookies);
  console.log(req.signedCookies.hello);
  console.log(req.headers.cookie);
  if (req.signedCookies.hello && req.signedCookies.hello === "world") {
    return res.send([{ id: 1, name: "tshirt", price: 59.99 }]);
  }
  return res.send({ msg: "U need a correct cookie" });
});

export default router;
