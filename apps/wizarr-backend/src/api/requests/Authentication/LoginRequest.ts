import { IsNotEmpty, IsString, MinLength } from "class-validator";
import type { LoginRequest as ILoginRequest } from "@wizarrrrr/wizarr-sdk";

export class LoginRequest implements ILoginRequest {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    username: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    password: string;
}
