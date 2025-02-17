import { Action } from "routing-controllers";
import { localAuthorizationCheck } from "./AuthenticationCheck";
import { Admin } from "../../../api/models/Account/AdminModel";
import { plainToClass } from "class-transformer";
import { connection } from "../../../config/connection";

export const currentUser = async (action: Action) => {
    const payload = await localAuthorizationCheck<{ sub: string }>(action.request.headers.authorization ?? action.context.cookies.get("refresh"));
    return plainToClass(Admin, connection.getRepository(Admin).findOneOrFail({ where: { id: payload.sub } }), { excludePrefixes: ["password"] });
};

export const getCurrentUser = async (sub: string) => {
    return plainToClass(Admin, connection.getRepository(Admin).findOneOrFail({ where: { id: sub } }), { excludePrefixes: ["password"] });
};
