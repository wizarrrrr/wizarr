import { NotFoundError } from "routing-controllers";

export class RoleNotFoundException extends NotFoundError {
    constructor(message?: string) {
        super(message || "Role not found!");
    }
}
