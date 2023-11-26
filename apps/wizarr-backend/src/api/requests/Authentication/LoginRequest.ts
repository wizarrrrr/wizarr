import { IsNotEmpty, IsString } from "class-validator";
import type { LoginRequest as ILoginRequest } from "@root/libs/wizarr-sdk/types";

export class LoginRequest implements ILoginRequest {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
