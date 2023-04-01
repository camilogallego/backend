const bcrypt = require("bcrypt")

const createHash = async password =>  await bcrypt.hashSync(password,bcrypt.genSaltSync())

const isValidPassword = async (password, encryptPassword) =>  await bcrypt.compareSync(password, encryptPassword);

module.exports = {
    createHash, isValidPassword
}