import { BadRequestError } from "routing-controllers";

export class InvalidServer extends BadRequestError {
    constructor(message?: string) {
        super(message || "Invalid media server connection");
    }
}
