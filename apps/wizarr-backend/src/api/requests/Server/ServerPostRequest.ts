import { IsNotEmpty, IsString, IsUrl, MinLength, IsOptional } from "class-validator";
import type { ServerRequest as IServerRequest } from "@wizarrrr/wizarr-sdk";

export class ServerRequest implements IServerRequest {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsUrl({ require_tld: false })
    host: string;

    @IsNotEmpty()
    @IsString()
    apiKey: string;
}
