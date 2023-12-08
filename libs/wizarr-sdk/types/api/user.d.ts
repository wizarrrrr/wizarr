import { ListResponse } from "..";
import { User as UserModel } from "../../../../apps/wizarr-backend/src/api/models/User/UserModel";

export type User = UserModel;
export type Users = User[];
export type UserStore = { users: Users };
export type UsersResponse = ListResponse<User>;
