import cartService from './cart.service.js';
import userService from './user.service.js';
import productsService from './products.service.js';
import ticketService from './ticket.service.js';
import restorePasswordRequestService from './restorePasswordRequest.service.js';
import { ProductManager, CartManager, UserManager, TicketManager, RestorePaswordRequestManager } from '../dao/index.js';

const CartService = new cartService(new CartManager());
const ProductsService = new productsService(new ProductManager());
const UserService = new userService(new UserManager());
const TicketService = new ticketService(new TicketManager());
const RestorePasswordRequestService = new restorePasswordRequestService(new RestorePaswordRequestManager());

export  {
    CartService,
    ProductsService,
    UserService,
    TicketService,
    RestorePasswordRequestService
}