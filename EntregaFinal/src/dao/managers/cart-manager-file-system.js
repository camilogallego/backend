import { existsSync, promises, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Logger } from '../../helpers';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isRequired = () => { throw Error("Parametro faltante. No se puede crear un Cart si falta algun parametro.") };

class CartManager {
    #currentId = 1
    constructor(filePath = isRequired) {
        this.path = join(__dirname, filePath);
        this.carts = [];
        this.init()
    }

    init = async () => {
        if(!existsSync(this.path)){
            Logger.warning(`El archivo especificado ${this.path} no existe aun. Creando...`);
            await promises.writeFile(this.path, "[]")
            Logger.debug(`Archivo ${this.path} Creado!`)
            return;
        }
        const readCarts = readFileSync(this.path);
        const carts = JSON.parse(readCarts);
        if(carts.length === 0) {
            return;
        }
        this.carts = carts;
        this.#currentId = carts[carts.length -1].id + 1;
    }

    addCart = async () => {
        const newCart = {
            id: this.#currentId,
            products: [],
        };
        
        this.carts.push(newCart);
        this.#currentId +=1;
        await promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    };
    getCartById = async (id = '') => {
        if (!existsSync(this.path)) {
            Logger.warning(`El archivo ${this.path} no existe`)
            return null;
        }
        const readCarts = await promises.readFile(this.path);
        const carts = JSON.parse(readCarts);
        const cart = carts.find(c => c.id === id); 
        if(!cart) {
            Logger.warning("Cart no encontrado");
            return null
        };
        return cart;
    }

    getCarts = async () => {
        if(existsSync(this.path)){
            const readCarts = await promises.readFile(this.path);
            const carts = JSON.parse(readCarts);
            return carts;
        }
        Logger.warning(`El archivo ${this.path} no existe`)
        return [];
    };
    
    getProductsByCartId = async (id = '') => {
        if (!existsSync(this.path)) {
            Logger.warning(`El archivo ${this.path} no existe`)
            return null;
        }
        const readCarts = await promises.readFile(this.path);
        const carts = JSON.parse(readCarts);
        const cart = carts.find(c => c.id === id); 
        if(!cart) {
            Logger.warning("Cart no encontrado");
            return null
        };
        return cart.products;
    }
    
    addProductToCart = async (cartId = '', productId) => {
        if (!existsSync(this.path)) {
            Logger.warning(`El archivo ${this.path} no existe`)
            return null;
        }

        
        const readCarts = await promises.readFile(this.path);
        const carts = JSON.parse(readCarts);      
        const cartIndex = carts.findIndex(c => c.id === cartId);
        const cart = carts[cartIndex];
        if(!cart) {
            Logger.warning("Cart no encontrado");
            return null
        };
        const productIndex = cart.products.findIndex(p => p.product === productId);
        const product = cart.products[productIndex];
        if(product) {
            this.carts[cartIndex].products[productIndex].quantity +=1;
        } else {
            this.carts[cartIndex].products.push({ product: productId, quantity: 1 });
        }
        await promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }    
};

export default CartManager;