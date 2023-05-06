import { ProductService } from "../repository/index.js";
import { paginateResults } from "../../../utils/paginate.js";

class ProductCtrl {
  productService;

  constructor() {
    this.productService = ProductService;
  }

  getProducts = async (req, res) => {
    try {
      const { limit = 10, page = 1 } = req.query;
      const products = await this.productService.getProducts();
      const paginatedResults = paginateResults(
        products,
        parseInt(limit),
        parseInt(page)
      );
      return res.json({
        message: "getProducts",
        products: paginatedResults.results,
        totalPages: paginatedResults.totalPages,
        currentPage: paginatedResults.currentPage,
        hasNextPage: paginatedResults.hasNextPage,
        hasPrevPage: paginatedResults.hasPrevPage,
        nextPage: paginatedResults.nextPage,
        prevPage: paginatedResults.prevPage,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong in getProducts",
        error: error.message,
      });
    }
  };

  filterProducts = async (req, res) => {
    try {
      const { limit = 3, sort = 1 } = req.query;
      const filteredProducts = await this.productService.filterProducts(
        limit,
        sort
      );
      return res.json({
        message: "filterProducts",
        products: filteredProducts,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong in filterProducts",
        error: error.message,
      });
    }
  };

  getProductById = async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await this.productService.getProductById(pid);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      return res.json({
        message: "getProductById",
        product: product,
      });
    } catch (error) {
      return res.status(500).json({
        message: "error product by id",
        error: error.message,
      });
    }
  };

  addProduct = async (req, res) => {
    try {
      const product = req.body;
      const newProduct = await this.productService.addProduct(product);
      return res.json({
        message: "addProduct",
        product: newProduct,
      });
    } catch (error) {
      return res.status(500).json({
        message: "error adding product",
        error: error.message,
      });
    }
  };

  updateProduct = async (req, res) => {
    try {
      const { pid } = req.params;
      const productData = req.body;

      const updatedProduct = await this.productService.updateProduct(
        pid,
        productData
      );

      if (!updatedProduct) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      return res.json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      return res.status(500).json({
        message: "not Product update",
        error: error.message,
      });
    }
  };
}

export default ProductCtrl
