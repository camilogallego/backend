import UserRepository from "../repository/user.repository.js";
import UserDTO from "../../dto/user.dto.js";
import { ErrorsHTTP } from "../services/error.handle.js";

const httpResp = new ErrorsHTTP();
class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await UserRepository.getAll();
      res.json(users.map((user) => UserDTO.toDTO(user)));
    } catch (error) {
      return httpResp.Error(res, "Error getting users");
    }
  }

  async createUser(req, res) {
    try {
      const userData = req.body;
      const newUser = await UserRepository.create(userData);
      return httpResp.Created(UserDTO.toDTO(newUser));
    } catch (error) {
      return httpResp.Error(res, "error creating user");
    }
  }
}
export default UserController