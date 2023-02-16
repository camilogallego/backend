const fs = require("fs/promises");
let id = 1;

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(product) {
    try {
      const data = JSON.parse(await fs.readFile(this.path));
      const { title, description, price, thumbnail, code, stock } = product;

      if (!title || !description || !code || !price || !thumbnail || !stock) {
        console.log(
          "Missing properties. All products must have title, description, and code."
        );
        return "try again";
      }
      if (data.products.some((p) => p.code === product.code)) {
        console.log("Code already exists. Please enter a unique code.");
        return "try again";
      }
      product.id = data.products.length + id;
      data.products.push({ ...product });
      await fs.writeFile(this.path, JSON.stringify(data));
      return "product added successfully!";
    } catch (error) {
      console.log(error);
    }
  }

  async getProducts() {
    try {
      const data = JSON.parse(await fs.readFile(this.path));
      return data.products;
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id) {
    try {
      const data = JSON.parse(await fs.readFile(this.path));
      return data.products.find((product) => product.id === id);
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(id, info) {
    try {
      const data = JSON.parse(await fs.readFile(this.path));
      let updateProduct = data.products.find((p) => p.id === id);
      let indexProduct = data.products.findIndex((p) => p.id === id);
      data.products[indexProduct] = { ...updateProduct, ...info };
      await fs.writeFile(this.path, JSON.stringify(data));
      return "update product";
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(id) {
    try {
      const data = JSON.parse(await fs.readFile(this.path));
      let indexProduct = data.products.findIndex((p) => p.id === id);
      data.products.splice(indexProduct, 1);
      await fs.writeFile(this.path, JSON.stringify(data));
      return "Item deleted";
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ProductManager;
