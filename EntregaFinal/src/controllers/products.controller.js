import productData from "../routes/mock-data.js";
import { ProductsService } from "../services/index.js";
import { CartService } from "../services/index.js";
import { API_VERSION } from "../config/config.js";
import { ProductDTO } from "../dto/index.js";
import { Logger, ROLES } from "../helpers/index.js";
import { sendMail } from "../helpers/index.js";

const sendProductDeleted = async (product) => {
  const subject = "Producto Eliminado";
  const html = `
    <div>
      <h1>Tu producto fue eliminado</h1>
      <p>Eliminamos el producto ${product.title} codigo: ${product.code} de la base de datos</p>
      <p>Muchas gracias!</p>
    </div>
    `;
  return await sendMail(product.owner, subject, html);
};

class ProductsController {
  validateNewPropsForUpdateProducts = async (req, res, next) => {
    const newProps = req.body;
    const propsArr = Object.keys(newProps);
    if (propsArr.length === 0) {
      return res.status(400).json({
        ok: false,
        message: `product not updated`,
        error: `No hay props para actualizar`,
      });
    }
    if (newProps["productId"]) {
      return res.status(400).json({
        ok: false,
        message: `product not updated`,
        error: `No se puede actualizar el producto con productId ${productId}`,
      });
    }
    next();
  };
  validateGetProductsQueryParams = async (req, res, next) => {
    const { limit = 10, page = 1, sort, query } = req.query;
    if (isNaN(limit) || Number(limit) < 0) {
      return res.status(400).json({
        ok: false,
        message: `El limite ingresado: ${limit} es invalido`,
        products: null,
      });
    }
    if (isNaN(page) || Number(page) < 0) {
      return res.status(400).json({
        ok: false,
        message: `El page ingresado: ${page} es invalido`,
        products: null,
      });
    }
    if (sort && sort !== "asc" && sort !== "desc") {
      return res.status(400).json({
        ok: false,
        message: `El sort ingresado: ${sort} es invalido`,
        products: null,
      });
    }
    if (query && query !== "stock" && (query.length <= 1 || !isNaN(query))) {
      return res.status(400).json({
        ok: false,
        message: `El query ingresado: ${query} es invalido`,
        products: null,
      });
    }
    next();
  };

  validateBodyForAddProduct = async (req, res, next) => {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;
    if (
      !title ||
      !description ||
      !code ||
      !price ||
      (status !== true && status !== false) ||
      !stock ||
      !category ||
      !thumbnails
    ) {
      return res.status(400).json({
        message: `Product not created1`,
        product: null,
        error:
          "You forget to pass one of: title, description, code, price, status, stock, category, thumbnails ",
        ok: false,
      });
    }

    if (!Number.isInteger(price) || !Number.isInteger(stock)) {
      return res.status(400).json({
        message: `Product not created2`,
        product: null,
        error: "Stock and Price must be numbers",
        ok: false,
      });
    }
    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof code !== "string" ||
      typeof category !== "string" ||
      (typeof thumbnails !== "string" && !Array.isArray(thumbnails))
    ) {
      return res.status(400).json({
        message: `Product not created3`,
        product: null,
        error:
          "Title, description, code and category must be strings. Thumbnails can be a string or an array of strings",
        ok: false,
      });
    }
    if (typeof status !== "boolean") {
      return res.status(400).json({
        message: `Product not created4`,
        product: null,
        error: "Status must be a boolean",
        ok: false,
      });
    }
    next();
  };

  validatePIDParam = async (_, res, next, pid) => {
    if (!pid || typeof pid !== "string") {
      return res.status(400).json({
        ok: false,
        message: `product not deleted`,
        error: `Error el id ingresado ${pid}, es Invalido`,
      });
    }
    next();
  };

  addProduct = async (req, res) => {
    try {
      const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      } = req.body;
      const productDTO = new ProductDTO({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
        owner: req.user.email,
      });
      const product = await ProductsService.addProduct(productDTO);
      if (product) {
        return res.json({
          message: `Product created succesfully`,
          product: product,
          ok: true,
        });
      }

      return res.status(400).json({
        message: `Product not created`,
        product: null,
        ok: false,
      });
    } catch (error) {
      return res.status(400).json({
        ok: false,
        message: `Product Not created, Error: ${error}`,
        product: null,
        error: error.message,
      });
    }
  };

  getProducts = async (req, res) => {
    try {
      const { limit = 10, page = 1, sort, query = {} } = req.query;
      let queryObject = {};
      if (query && query === "stock") {
        queryObject = { stock: { $gt: 0 } };
      } else if (query && query.length > 1 && isNaN(query)) {
        queryObject = {
          category: query,
        };
      } else {
        queryObject = {};
      }
      const sortQueryParam = (sort && `&sort=${sort}`) || "";

      const products = await ProductsService.getProducts(
        limit,
        page,
        sort,
        queryObject
      );

      if (!products || products.length === 0 || products.docs.length === 0) {
        return res.status(400).json({
          status: "error",
          payload: null,
          totalPages: null,
          prevPage: null,
          nextPage: null,
          page: page,
          hasPrevPage: false,
          hasNextPage: false,
          prevLink: null,
          nextLink: null,
        });
      }

      const {
        docs,
        limit: limitPag,
        totalPages,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
        page: currentPage,
      } = products;

      if (docs && docs.length > 0) {
        return res.json({
          status: "success",
          payload: docs,
          totalPages: totalPages,
          prevPage: prevPage,
          nextPage: nextPage,
          page: currentPage,
          hasPrevPage: hasPrevPage,
          hasNextPage: hasNextPage,
          prevLink:
            (hasPrevPage &&
              `/api/${API_VERSION}/products?query=${query}&limit=${limit}${sortQueryParam}&page=${prevPage}`) ||
            null,
          nextLink:
            (hasNextPage &&
              `/api/${API_VERSION}/products?query=${query}&limit=${limit}${sortQueryParam}&page=${nextPage}`) ||
            null,
        });
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  deleteProduct = async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await ProductsService.getProductById(pid);
      if (req.user.role === ROLES.PREMIUM) {
        if (product.owner !== req.user.email) {
          return res.status(401).json({
            ok: false,
            message: `product not deleted`,
            error: "You can't delete products you don't own.",
          });
        }
      }
      if (req.user.role !== ROLES.USER) {
        const deletedProducts = await ProductsService.deleteProduct(pid);
        const deletedProductsFromAllcarts =
          await CartService.deleteProductFromAllCarts(pid);
        if (
          deletedProducts &&
          deletedProducts.deletedCount > 0 &&
          deletedProductsFromAllcarts &&
          deletedProductsFromAllcarts.acknowledged === true
        ) {
          if (product.owner && product.owner !== "admin") {
            await sendProductDeleted(product);
          }
          return res.status(200).json({
            ok: true,
            message: `Product deleted`,
            deletedProducts: deletedProducts,
            deletedProductsFromAllcarts: deletedProductsFromAllcarts,
          });
        }
      }
      return res.status(400).json({
        ok: false,
        message: `product not deleted`,
        error:
          "Error al eliminar el producto. Posiblemente el producto ingresado no existe",
      });
    } catch (error) {
      Logger.error(error);
    }
  };

  updateProduct = async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await ProductsService.getProductById(pid);
      if (req.user.role === ROLES.PREMIUM) {
        if (product.owner !== req.user.email) {
          return res.status(401).json({
            ok: false,
            message: `product not updated`,
            error: "You can't update products you don't own.",
          });
        }
      }
      if (req.user.role !== ROLES.USER) {
        const newProps = req.body;
        const productUpdated = await ProductsService.updateProduct(
          pid,
          newProps
        );
        if (productUpdated && productUpdated.modifiedCount > 0) {
          return res.json({
            ok: true,
            message: `product updated`,
          });
        }
      }
      return res.status(401).json({
        ok: false,
        message: `product not updated`,
        error: `No se puede actualizar el producto con productId ${pid}. No tenes permisos para hacerlo`,
      });
    } catch (error) {
      Logger.error(error);
    }
  };

  insertion = async (req, res) => {
    try {
      const newProducts = productData.map((product) => new ProductDTO(product));
      let result = await ProductsService.insertion(newProducts);
      return res.json({
        message: "all the products are inserted succesfully",
        students: result,
      });
    } catch (error) {
      Logger.error(error);
    }
  };
}

export default ProductsController;
