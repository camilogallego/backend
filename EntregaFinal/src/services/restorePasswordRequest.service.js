import { Logger, sendMail } from '../helpers/index.js';
import { HOST, PORT } from '../config/config.js';

export default class RestorePasswordRequestService {
  constructor(dao) {
    this.dao = dao;
  }

  createRequest = async userId => {
    try {
      const restoreRequest = await this.dao.createRequest(userId);
      return restoreRequest;
    } catch (error) {
        Logger.error('Error creating restore password request in service. userId: ,', userId, 'Error:', error)
        return null;
    }
  };

  getRestorePasswordRequest = async userId => {
    try {
        const restorePasswordRequest = await this.dao.getRestorePasswordRequest(userId)
        return restorePasswordRequest;
    } catch (error) {
        Logger.error('Error getting restore password request in service', userId ,'Error:', error)
        return null;
    }
  };
  
  deleteRequest = async userId => {
    try {
        const deletedRequest = await this.dao.deleteRequest(userId);
        return deletedRequest;
    } catch (error) {
        Logger.error('Error deleting request for userId: ', userId ,'Error:', error)
        return null;
    }
  };

  sendRestorePasswordMail = async (email, userId) => {
    const subject = "Restablecimiento de Contraseña";
    const html = `
    <div>
      <h1>Solicitud de Restablecimiento de Contraseña</h1>
      <p>Se creo una nueva solicitud de restablecimiento de contraseña para la cuenta registrada con el mail ${email}</p>
      <p>Para crear una nueva contraseña, ingresar al sigiente link: <a href="http://${HOST}:${PORT}/restorePassword/${userId}">Restablecer Contraseña</a></p>
      <p>Muchas gracias!</p>
    </div>
    `;
    return await sendMail(email,subject,html);
  }
}
