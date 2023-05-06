import { writeFile, readFile } from "fs/promises";

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
  }

  async addProduct(product) {
    try {
      this.products = await this.getProducts();
      const { title, description, price, thumbnail, code, stock, category } = product;
      if (
        !title ||
        !description ||
        !code ||
        !price ||
        !thumbnail ||
        !stock ||
        !category
      ){
        console.log(
          "Missing properties. All products must have title, description, and code."
        );
        return "try again";
      }
      if (this.products.some((p) => p.code === product.code)) {
        console.log("Code already exists. Please enter a unique code.");
        return "try again";
      }
      let id =this.products.length === 0 ? 1 : this.products[this.products.length - 1].id + 1;
      this.products.push({id, ...product });
      await writeFile(this.path, JSON.stringify(this.products));
      return `${product.title}`
    } catch (error) {
      console.log(error);
    }
  }

  async getProducts() {
    try {
      const data = JSON.parse(await readFile(this.path, "utf-8"));
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id) {
    try {
      const data = JSON.parse(await readFile(this.path));
      return data.find((product) => product.id === id);
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(id, info) {
    try {
      const data = JSON.parse(await readFile(this.path));
      let updateProduct = data.find((p) => p.id === id);
      let indexProduct = data.findIndex((p) => p.id === id);
      data[indexProduct] = { ...updateProduct, ...info };
      await writeFile(this.path, JSON.stringify(data));
      return "update product";
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(id) {
    try {
      this.products = await this.getProducts();
      this.products = this.products.filter((p) => p.id !== Number(id));
      await writeFile(this.path, JSON.stringify(this.products));
      return id
    } catch (error) {
      console.log(error);
    }
  }
}

export default ProductManager;
