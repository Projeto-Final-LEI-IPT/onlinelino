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

export function hasContentChanged(original, current) {
  return JSON.stringify(original) !== JSON.stringify(current);
}

export function removeHtmlTags(str) {
    if (!str) return '';
    return str.replace(/<[^>]*>/g, '').trim();
  }

export  function cleanObjectStrings(obj) {
      const cleaned = {};
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          cleaned[key] = removeHtmlTags(obj[key]);
        } else {
          cleaned[key] = obj[key];
        }
      }
      return cleaned;
    }

