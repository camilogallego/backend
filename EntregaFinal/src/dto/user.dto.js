import { createHash } from '../utils.js';
import { ROLES } from '../helpers/index.js';

class UserDTO {
    constructor(user){
        this.email = user.email;
        this.password = createHash(user.password);
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.age = user.age;
        this.address = user.address;
        this.cart = user.cart;
        this.role = ROLES[user.role] || ROLES.USER;
    }
}

export default UserDTO