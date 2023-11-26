import { UnauthorizedError } from "routing-controllers";

export class InvalidCredentials extends UnauthorizedError {
    constructor(message?: string) {
        super(message || "Invalid credentials");
    }
}
