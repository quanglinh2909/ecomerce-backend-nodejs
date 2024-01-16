const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode");
class ErroResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestException extends ErroResponse {
  constructor(message = ReasonPhrases.CONFLICT, status = StatusCodes.CONFLICT) {
    super(message, status);
  }
}

class BadRequestException extends ErroResponse {
  constructor(
    message = ReasonPhrases.BAD_REQUEST,
    status = StatusCodes.BAD_REQUEST
  ) {
    super(message, status);
  }
}

class NotFoundExeption extends ErroResponse {
  constructor(
    message = ReasonPhrases.NOT_FOUND,
    status = StatusCodes.NOT_FOUND
  ) {
    super(message, status);
  }
}

class InternalServerError extends ErroResponse {
  constructor(
    message = ReasonPhrases.INTERNAL_SERVER_ERROR,
    status = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message, status);
  }
}

class ForbiddenException extends ErroResponse {
  constructor(
    message = ReasonPhrases.FORBIDDEN,
    status = StatusCodes.FORBIDDEN
  ) {
    super(message, status);
  }
}

class UnauthorizedException extends ErroResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    status = StatusCodes.UNAUTHORIZED
  ) {
    super(message, status);
  }
}

module.exports = {
  ErroResponse,
  ConflictRequestException,
  BadRequestException,
  NotFoundExeption,
  InternalServerError,
  ForbiddenException,
  UnauthorizedException,
};
