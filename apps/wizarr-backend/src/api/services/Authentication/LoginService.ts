import { InvalidCredentials } from "../../exceptions/InvalidCredentials";
import { AdminRepository } from "../../repositories/Account/AdminRepository";
import { LoginRequest } from "../../requests/Authentication/LoginRequest";
import { InjectRepository } from "../../../decorators/InjectRepository";
import { checkPassword } from "../../../utils/password.helper";
import { Service } from "typedi";
import { Session } from "../../models/Account/SessionsModel";
import { Admin } from "../../models/Account/AdminModel";
import { Context } from "koa";
import { createAccessToken, createRefreshToken, getJTI } from "../../../utils/jwt.helper";
import { StripPassword } from "../../../decorators/StripPasswordDecorator";

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
    @StripPassword()
    public async login(data: LoginRequest, context?: Context) {
        // Get the admin from the database by username, throw an error if it doesn't exist
        const admin = await this.adminRepository.findOne({ where: { username: data.username } });
        if (!admin) throw new InvalidCredentials();

        // Check if the password matches and throw an error if it doesn't
        if (!(await checkPassword(data.password, admin.password))) throw new InvalidCredentials();

        // Create a JWT Token for the admin
        const accessToken = await createAccessToken(admin.id);
        const refreshToken = await createRefreshToken(admin.id);

        // Get the JTI from the Access Token & Refresh Token
        const accessJTI = await getJTI(accessToken);
        const refreshJTI = await getJTI(refreshToken);

        // Create a session for the admin
        await this.createSession(admin, { access: accessJTI, refresh: refreshJTI }, context);

        // Set the token to the cookie
        context?.cookies.set("refresh", refreshToken, { httpOnly: true, sameSite: "strict" });

        // Return the admin
        return { user: admin, token: accessToken };
    }

    /**
     * Logout of the server
     * @returns
     */
    public async logout(context: Context) {
        // Check if the refresh token is set in the cookies
        if (!context.cookies.get("refresh")) throw new InvalidCredentials("Missing refresh token");

        // Get the refresh token from the cookies
        const refreshToken = context.cookies.get("refresh");

        // Get the JTI from the refresh token
        const refreshJTI = await getJTI(refreshToken);

        // Delete the session from the database by the refresh token
        await Session.delete({ refreshJti: refreshJTI });

        // Remove the refresh token from the cookies
        context.cookies.set("refresh", "", { httpOnly: true, sameSite: "strict" });

        // Return the message
        return { message: "Successfully logged out" };
    }

    /**
     * Refresh JWT Token
     * @returns
     */
    public async refresh(context: Context) {
        // Check if the refresh token is set in the cookies
        if (!context.cookies.get("refresh")) throw new InvalidCredentials("Missing refresh token");

        // Get the refresh token from the cookies
        const refreshToken = context.cookies.get("refresh");

        // Get the JTI from the refresh token
        const refreshJTI = await getJTI(refreshToken);

        // Get the session from the database
        const session = await Session.findOne({ where: { refreshJti: refreshJTI }, relations: ["user"] });

        // Check if the session exists
        if (!session) throw new InvalidCredentials();

        // Create a new JWT Token for the user
        const accessToken = await createAccessToken(session.user.id);
        const newRefreshToken = await createRefreshToken(session.user.id);

        // Get the JTI from the Access Token
        const accessJTI = await getJTI(accessToken);
        const newRefreshJTI = await getJTI(newRefreshToken);

        // Update the cookies with the new refresh token
        context.cookies.set("refresh", newRefreshToken, { httpOnly: true, sameSite: "strict" });

        // Update the session
        session.accessJti = accessJTI;
        session.refreshJti = newRefreshJTI;
        await session.save();

        // Get the admin from the database by username, throw an error if it doesn't exist
        const admin = await this.adminRepository.findOne({ where: { id: session.userId } });
        if (!admin) throw new InvalidCredentials();

        // Return the admin with the new access token
        return { user: admin, token: accessToken };
    }

    /**
     * Create a new Session for the User
     * @param user The user to create a session for
     * @returns The session
     */
    public async createSession(user: Admin, jti?: { access: string; refresh: string }, context?: Context) {
        // Create a new session
        const session = new Session();

        // Set the session details
        session.user = user;
        session.ip = context?.ip;
        session.userAgent = context?.header["user-agent"];
        session.accessJti = jti?.access;
        session.refreshJti = jti?.refresh;

        // Return the session
        return session.save();
    }
}
