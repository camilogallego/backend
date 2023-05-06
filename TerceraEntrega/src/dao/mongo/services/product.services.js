import productModel from "../models/index.js";

class ProductServiceDao {
  constructor(dao) {
    this.dao = dao;
  }

  getProducts = async () => {
    try {
      const products = await productModel.find({}).lean();
      return products;
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  getProduct = async (id) => {
    try {
      const product = await productModel.findById({ _id: id }).lean();
      return product;
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  addProduct = async (product) => {
    try {
      await productModel.create(product);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  updateProduct = async (id, product) => {
    try {
      await productModel.findByIdAndUpdate(id, { ...product });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  deleteProduct = async (id) => {
    try {
      await productModel.findByIdAndDelete(id);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
}

export default ProductServiceDao;