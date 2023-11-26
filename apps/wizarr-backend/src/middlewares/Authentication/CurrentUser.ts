import { Action } from "routing-controllers";
import { localAuthorizationCheck } from "./AuthenticationCheck";
import { Admin } from "../../api/models/AdminModel";
import { plainToClass } from "class-transformer";

export const currentUser = async (action: Action) => {
    const payload = await localAuthorizationCheck<{ user: Admin }>(action.request.headers.authorization);
    return plainToClass(Admin, payload.user);
};
