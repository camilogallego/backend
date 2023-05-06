import cartModel from "../models/index.js";
import productModel from "../models/index.js";

class CartServiceDao {
  addCart = async () => {
    try {
      await cartModel.create({});
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  getProductsByCartId = async (id) => {
    try {
      const cart = await cartModel
        .findById(id)
        .populate("products.product")
        .lean();
      return cart;
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  addProductToCart = async (cid, pid) => {
    try {
      const cart = await cartModel.findById(cid);
      const product = await productModel.findById(pid);
      cart.products.push({ product: product._id, quantity: 1 });
      cart.save();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  delProductFromCart = async (cid, pid) => {
    try {
      await cartModel.findByIdAndUpdate(cid, {
        $pull: { products: { _id: pid } },
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  delProducts = async (cid) => {
    try {
      await cartModel.findByIdAndUpdate(cid, {
        $pull: { products: {} },
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  updateQuantity = async (cid, pid, quantity) => {
    const cart = await cartModel.findById(cid);
    const product = cart.products.find((p) => p._id.toString() === pid);
    product.quantity += quantity;
    cart.save();
  };
}

export default CartServiceDao;
