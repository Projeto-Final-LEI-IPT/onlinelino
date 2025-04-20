export const SERVER_URL = 'http://onlinelino.ipt.pt:8080';
export const BACKOFFICE_URL = 'backoffice';

export const createResponseOnSuccess = (message,token = null, error = null) => {
    return {
        message,
        token,
        error
    };
};
export default createResponseOnSuccess;
