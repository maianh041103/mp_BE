const { HttpStatusCode } = require("./errorCodes");

export function respondItemSuccess(data, message = "Success") {
  return {
    code: HttpStatusCode.SUCCESS_RESPONSE,
    message,
    data,
  };
}

export function respondArraySuccess(data, totalItem, message = "Success") {
  return {
    code: HttpStatusCode.SUCCESS_RESPONSE,
    message,
    data,
    totalItem,
  };
}

export function respondWithError(errorCode, message = "Error", data = {}) {
  return {
    code: errorCode,
    message,
    errors: data,
  };
}
