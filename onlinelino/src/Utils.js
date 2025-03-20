export const SERVER_URL = 'http://193.137.5.232:8080';
export const BACKOFFICE_URL = 'backoffice';

const createResponseOnSuccess = (message,token = null, error = null) => {
    return {
        message,
        token,
        error
    };
};
module.exports = createResponseOnSuccess;