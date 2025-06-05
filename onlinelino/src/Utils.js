export const SERVER_URL = 'http://onlinelino.ipt.pt:8080';
export const BACKOFFICE_URL = 'backoffice';

 const createResponseOnSuccess = (message,token = null, expiresIn) => {
    return {
        message,
        token,
        expiresIn
    };
};
export default createResponseOnSuccess;
