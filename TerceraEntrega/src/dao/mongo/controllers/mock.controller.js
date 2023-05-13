import { generateProducts } from "../utils";

class MockController {
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

export default MockController;
