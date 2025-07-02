 const createResponseOnSuccess = (message,token = null, expiresIn) => {
    return {
        message,
        token,
        expiresIn
    };
};
module.exports = createResponseOnSuccess;