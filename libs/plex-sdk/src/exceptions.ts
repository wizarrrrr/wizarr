export class BadRequest extends Error {
  override message = 'An invalid request, generally a user error.';

  constructor(message: string) {
    super(message);
    this.name = 'BadRequest';
    this.message = message;
  }
}

export class NotFound extends Error {
  override message = 'Request media item or device is not found.';

  constructor(message: string) {
    super(message);
    this.name = 'NotFound';
    this.message = message;
  }
}

export class UnknownType extends Error {
  override message = 'Unknown library type.';

  constructor(message: string) {
    super(message);
    this.name = 'UnknownType';
    this.message = message;
  }
}

export class Unsupported extends Error {
  override message = 'Unsupported client request.';

  constructor(message: string) {
    super(message);
    this.name = 'Unsupported';
    this.message = message;
  }
}

export class Unauthorized extends Error {
  override message = 'Invalid username or password.';

  constructor(message: string) {
    super(message);
    this.name = 'Unauthorized';
    this.message = message;
  }
}
