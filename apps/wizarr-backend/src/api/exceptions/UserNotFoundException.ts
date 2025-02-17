import { NotFoundError } from "routing-controllers";

export class UserNotFoundException extends NotFoundError {
    constructor(message?: string) {
        super(message || "User not found!");
    }
}
