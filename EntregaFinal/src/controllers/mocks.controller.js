import { generateProducts } from "../utils.js";

class MocksController {
  getMockProducts = async (req, res) => {
    const products = generateProducts(100);
    if (products) {
      return res.json({
        status: "success",
        payload: products,
      });
    }
  };
}

export default MocksController;
