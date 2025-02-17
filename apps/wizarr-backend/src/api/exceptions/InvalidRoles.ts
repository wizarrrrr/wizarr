import { UnauthorizedError } from "routing-controllers";

export class InvalidRoles extends UnauthorizedError {
    constructor(message?: string) {
        super(message || "Invalid roles");
    }
}
