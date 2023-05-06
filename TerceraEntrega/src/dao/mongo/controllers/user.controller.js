import UserRepository from "../repository/user.repository.js";
import UserDTO from "../../dto/user.dto.js";

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await UserRepository.getAll();
      res.json(users.map((user) => UserDTO.toDTO(user)));
    } catch (error) {
      res.status(500).json({ error: "Error getting users" });
    }
  }

  async createUser(req, res) {
    try {
      const userData = req.body;
      const newUser = await UserRepository.create(userData);
      res.status(201).json(UserDTO.toDTO(newUser));
    } catch (error) {
      res.status(500).json({ error: "error creating user" });
    }
  }
}
export default UserController