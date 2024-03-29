import { CartService } from "../services/index.js";
import { ProductsService } from "../services/index.js";
import { TicketService } from "../services/index.js";
import moment from "moment";
import { TicketDTO } from "../dto/index.js";
import { Logger, ROLES } from "../helpers/index.js";

class CartController {
  validatePIDParam = async (_, res, next, pid) => {
    if (!pid || typeof pid != "string") {
      return res.status(400).json({
        message: `id type is not correct for pid`,
        products: null,
      });
    }
    next();
  };

  validateCIDParam = async (_, res, next, cid) => {
    if (!cid || typeof cid != "string" || Number.isInteger(cid)) {
      return res.status(400).json({
        message: `id type is not correct`,
        products: null,
      });
    }
    next();
  };

  getProductsByCart = async (req, res) => {
    try {
      const id = req.params.cid;
      const products = await CartService.getProductsByCart(id);
      if (products) {
        return res.status(200).json({
          message: `cart found successfully`,
          products: products,
        });
      }
      return res.status(400).json({
        message: `cart not found ${id}`,
        products: null,
      });
    } catch (error) {
      Logger.error(error);
    }
  };

  createCart = async (req, res) => {
    try {
      const cart = (await CartService.createCart()) ?? null;
      if (!cart) {
        return res.status(500).json({
          message: `Couldn't create the Cart`,
          cart: null,
        });
      }

      return res.status(200).json({
        message: `Cart created succesfully`,
        cart: cart,
      });
    } catch (error) {
      Logger.error(error);
    }
  };

  addProductToCart = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const product = await ProductsService.getProductById(pid);
      if (req.user.role === ROLES.PREMIUM) {
        if (product.owner === req.user.email) {
          return res.status(401).json({
            message: "Product not added",
            error: `You cant add products you own to the cart`,
            products: null,
            ok: false,
          });
        }
      }
      const updateDoc = await CartService.addProductToCart(cid, pid);
      if (updateDoc && updateDoc.modifiedCount > 0) {
        const products = await CartService.getProductsByCart(cid);
        return res.status(200).json({
          message: `Cart updated Successfully`,
          products: products,
        });
      }

      return res.status(400).json({
        message: `Product not added. Cart or Product not found`,
        products: null,
        ok: false,
      });
    } catch (error) {
      Logger.error(error);
    }
  };

  validateQuantity = async (req, res, next) => {
    const { quantity } = req.body;
    if (!quantity || isNaN(quantity)) {
      return res.status(400).json({
        message: `quantity type is not correct or is empty`,
        products: null,
      });
    }
    next();
  };

  deleteProductFromAllCarts = async (req, res) => {
    try {
      const { pid } = req.params;
      const deleted = await CartService.deleteProductFromAllCarts(pid);
      return res.status(200).json({
        message: `prod deleted Successfully`,
        deleted: deleted,
      });
    } catch (error) {
      Logger.error(error);
    }
  };

  updateProductQuantity = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const updated = await CartService.updateProductQuantity(
        cid,
        pid,
        quantity
      );
      if (updated) {
        const products = await CartService.getProductsByCart(cid);
        return res.status(200).json({
          message: `Quantity updated Successfully`,
          products: products,
        });
      }
      return res.status(400).json({
        message: `Quantity not updated. Cart or product id are not correct`,
        products: null,
      });
    } catch (error) {
      Logger.error(error);
    }
  };

  deleteProductFromCart = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      await CartService.deleteProductFromCart(cid, pid);
      const products = await CartService.getProductsByCart(cid);
      return res.status(200).json({
        message: `product deleted Successfully`,
        payload: products,
      });
    } catch (error) {
      Logger.error(error);
      return res.status(400).json({
        message: `product not deleted Successfully`,
        payload: products,
      });
    }
  };
  purchaseProducts = async (req, res) => {
    try {
      const { cid } = req.params;
      let totalPrice = 0;
      let unavaliableProducts = [];
      let ticket = null;
      let boughtProducts = [];

      const cartProducts = await CartService.getProductsByCart(cid);
      if (!cartProducts) {
        return res.status(400).json({
          message: `No hay productos asociados al carrito ${cid}`,
          payload: null,
        });
      }

      const availiableProducts = Promise.all(
        cartProducts.map(async (prod) => {
          const product = await ProductsService.getProductById(prod.productId);
          if (product.stock >= prod.quantity) {
            return prod;
          } else {
            unavaliableProducts.push(prod);
          }
        })
      );
      if (availiableProducts) {
        for (let product of await availiableProducts) {
          if (product) {
            const productInStock = await ProductsService.getProductById(
              product.productId
            );
            const updated = await ProductsService.updateProduct(
              product.productId,
              { stock: productInStock.stock - product.quantity }
            );
            if (updated) {
              totalPrice +=
                Number(product.quantity) * Number(productInStock.price);
              boughtProducts.push(product);
              await CartService.deleteAllProductUnitsFromCart(
                cid,
                product.productId
              );
            }
          }
        }
        if (boughtProducts && boughtProducts.length > 0) {
          const purchase_datetime = moment().format("MMMM Do YYYY, h:mm:ss a");
          const purchaser = req.user.email;
          const ticketDTO = new TicketDTO({
            purchaser,
            purchase_datetime,
            amount: totalPrice,
          });
          ticket = await TicketService.createTicket(ticketDTO);
          Logger.info("ticket created", ticket);
        }
      }
      if (ticket) {
        return res.status(200).json({
          message: `products bought Successfully`,
          ticket: ticket,
          notAvailableProducts: unavaliableProducts,
        });
      }
      return res.status(400).json({
        message: `products not bought`,
        ticket: null,
        notAvailableProducts: unavaliableProducts,
      });
    } catch (error) {
      Logger.error(error);
      return res.status(400).json({
        message: `products not bought`,
        ticket: null,
        notAvailableProducts: null,
        error: error,
      });
    }
  };
  deleteAllproductsFromCart = async (req, res) => {
    try {
      const { cid } = req.params;
      await CartService.deleteAllProductsFromCart(cid);
      const products = await CartService.getProductsByCart(cid);
      return res.status(200).json({
        message: `products deleted Successfully`,
        payload: products,
      });
    } catch (error) {
      Logger.error(error);
    }
  };

  validateNewProducts = async (req, res, next) => {
    const newProducts = req.body;
    if (!newProducts || !Array.isArray(newProducts)) {
      return res.status(400).json({
        message: `array not passed`,
        payload: null,
      });
    }

    if (newProducts.length < 1) {
      return res.status(400).json({
        message: `array is empty`,
        payload: null,
      });
    }
    for (const product of newProducts) {
      if (
        !product.productId ||
        !product.quantity ||
        typeof product.productId !== "string" ||
        isNaN(product.quantity)
      ) {
        return res.status(400).json({
          message: `Products don't have the required format: [{_id: ...(oid) , productId: ...(string) , quantity: ...(int) }]`,
          payload: null,
        });
      }
    }
    next();
  };

  updateProductsFromCart = async (req, res) => {
    try {
      const { cid } = req.params;
      const newProducts = req.body;
      await CartService.updateProductsFromCart(cid, newProducts);
      const products = await CartService.getProductsByCart(cid);
      if (products) {
        return res.status(200).json({
          message: `products updated Successfully`,
          payload: products,
        });
      }
      return res.status(400).json({
        message: `No se pudo actualziar los productos`,
        payload: null,
      });
    } catch (error) {
      Logger.error(error);
    }
  };
}

export default CartController;
