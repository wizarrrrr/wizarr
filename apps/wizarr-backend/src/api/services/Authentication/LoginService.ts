import { InvalidCredentials } from "@/api/exceptions/InvalidCredentials";
import { AdminRepository } from "@/api/repositories/AdminRepository";
import { LoginRequest } from "@/api/requests/Authentication/LoginRequest";
import { InjectRepository } from "@/decorators";
import { checkPassword } from "@/utils/password.helper";
import { Service } from "typedi";
import { Session } from "@/api/models/SessionsModel";
import { Admin } from "@/api/models/AdminModel";
import { Context } from "koa";
import { SignOptions, sign, decode } from "jsonwebtoken";
import { privateKey } from "@/utils/secret.helper";
import { randomBytes } from "crypto";

@Service()
export class LoginService {
    /**
     * Creates an instance of LoginService.
     * @param adminRepository
     * @returns
     */
    constructor(@InjectRepository() private adminRepository: AdminRepository) {}

    /**
     * Login to the server with your username and password
     * @param data The login data
     * @returns The admin object
     */
    public async login(data: LoginRequest, context?: Context) {
        // Get the admin from the database by username
        const admin = await this.adminRepository.findOne({ where: { username: data.username } });

        // Check if the admin exists
        if (!admin) throw new InvalidCredentials();

        // Check if the password matches
        if (!(await checkPassword(data.password, admin.password))) throw new InvalidCredentials();

        // Create a JWT Token for the admin
        const token = await this.createToken(admin);

        // Get the JTI from the JWT Token
        const jti = await this.getJTI(token);

        // Create a session for the admin
        await this.createSession(admin, jti, context);

        // Remove the password from the admin object
        delete admin.password;

        // Set the token to the cookie
        context?.cookies.set("token", token, { httpOnly: true, sameSite: "strict" });

        // Return the admin
        return { message: "Successfully logged in", auth: { user: admin, token, refresh_token: token } };
    }

    /**
     * Logout of the server
     * @returns
     */
    public async logout(context?: Context) {
        // TODO: Implement logout
        context?.cookies.set("token", "", { httpOnly: true, sameSite: "strict" });
    }

    /**
     * Refresh JWT Token
     * @returns
     */
    public async refresh() {}

    /**
     * Create a new JWT Token for the User
     * @param user The user to create a token for
     * @returns The JWT Token
     */
    public async createToken(user: Admin) {
        // Create a JWT options object
        const options: SignOptions = {
            expiresIn: "1h",
            issuer: "wizarr",
            jwtid: randomBytes(16).toString("hex"),
            algorithm: "RS256",
        };

        // Remove the password from the user object
        delete user.password;

        // Create a JWT Token
        return sign({ user }, await privateKey(), options);
    }

    /**
     * Get the JTI from the JWT Token
     * @param token The JWT Token
     * @returns The JTI
     */
    public async getJTI(token: string) {
        // Decode the JWT Token
        const decoded = decode(token);

        // Check if the JWT Token is valid
        if (typeof decoded === "string") throw new Error("Invalid JWT Token");

        // Return the JTI
        return decoded?.jti;
    }

    /**
     * Create a new Session for the User
     * @param user The user to create a session for
     * @returns The session
     */
    public async createSession(user: Admin, jti?: string, context?: Context) {
        // Create a new session
        const session = new Session();

        // Set the session details
        session.user = user;
        session.ip = context?.ip;
        session.userAgent = context?.header["user-agent"];
        session.accessJti = jti;

        // Return the session
        return session.save();
    }
}
