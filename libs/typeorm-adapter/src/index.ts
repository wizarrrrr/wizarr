import type { Adapter, AdapterUser, AdapterAccount, AdapterSession } from "@auth/core/adapters";
import { DataSource, EntityManager } from "typeorm";
import * as defaultEntities from "./entities.js";
import { updateConnectionEntities } from "./utils.js";

export const entities = defaultEntities;
export type Entities = typeof entities;

/** This is the interface for the TypeORM adapter options. */
export interface TypeORMAdapterOptions {
    entities: Entities;
}

export async function getManager(options: { dataSource: DataSource; entities: Entities }): Promise<EntityManager> {
    const manager = options.dataSource.manager;

    if (!manager.connection.isInitialized) {
        await manager.connection.initialize();
    }

    if (process.env["NODE_ENV"] !== "production") {
        await updateConnectionEntities(manager.connection, Object.values(options.entities));
    }

    return manager;
}

export function TypeORMAdapter(dataSource: DataSource, options: TypeORMAdapterOptions): Adapter {
    const entities = options.entities;
    const c = {
        dataSource,
        entities: {
            UserEntity: entities.UserEntity,
            SessionEntity: entities.SessionEntity,
            AccountEntity: entities.AccountEntity,
            VerificationTokenEntity: entities.VerificationTokenEntity,
        },
    };

    const UserEntityName = c.entities.UserEntity.name;
    const AccountEntityName = c.entities.AccountEntity.name;
    const SessionEntityName = c.entities.SessionEntity.name;
    const VerificationTokenEntityName = c.entities.VerificationTokenEntity.name;

    return {
        /**
         * Creates a new user.
         * @param data - The user data.
         * @returns The created user.
         */
        createUser: async (data) => {
            const m = await getManager(c);
            const user = await m.save(UserEntityName, data);
            return user;
        },
        /**
         * Gets a user by ID.
         * @param id - The user ID.
         * @returns The user.
         */
        // @ts-expect-error - TypeORM doesn't have a type for this property
        async getUser(id) {
            const m = await getManager(c);
            const user = await m.findOne(UserEntityName, { where: { id } });
            if (!user) return null;
            return { ...user };
        },
        /**
         * Gets a user by email.
         * @param email - The user email.
         * @returns The user.
         */
        // @ts-expect-error - TypeORM doesn't have a type for this property
        async getUserByEmail(email) {
            const m = await getManager(c);
            const user = await m.findOne(UserEntityName, { where: { email } });
            if (!user) return null;
            return { ...user };
        },
        /**
         * Gets a user by provider and provider account ID.
         * @param provider_providerAccountId - The provider and provider account ID.
         * @returns The user.
         */
        async getUserByAccount(provider_providerAccountId) {
            const m = await getManager(c);
            // @ts-expect-error - TypeORM doesn't have a type for this property
            const account = await m.findOne<AdapterAccount & { user: AdapterUser }>(
                AccountEntityName,
                // @ts-expect-error - TypeORM doesn't have a type for this property
                { where: provider_providerAccountId, relations: ["user"] },
            );
            if (!account) return null;
            return account.user ?? null;
        },
        /**
         * Updates a user.
         * @param data - The user data.
         * @returns The updated user.
         */
        // @ts-expect-error - TypeORM doesn't have a type for this property
        async updateUser(data) {
            const m = await getManager(c);
            const user = await m.save(UserEntityName, data);
            return user;
        },
        /**
         * Deletes a user.
         * @param id - The user ID.
         * @returns The deleted user.
         */
        async deleteUser(id) {
            const m = await getManager(c);
            await m.transaction(async (tm) => {
                await tm.delete(AccountEntityName, { userId: id });
                await tm.delete(SessionEntityName, { userId: id });
                await tm.delete(UserEntityName, { id });
            });
        },
        /**
         * Links an account.
         * @param data - The account data.
         * @returns The linked account.
         */
        async linkAccount(data) {
            const m = await getManager(c);
            const account = await m.save(AccountEntityName, data);
            return account;
        },
        /**
         * Unlinks an account.
         * @param providerAccountId - The provider and provider account ID.
         * @returns The unlinked account.
         */
        async unlinkAccount(providerAccountId) {
            const m = await getManager(c);
            await m.delete<AdapterAccount>(AccountEntityName, providerAccountId);
        },
        /**
         * Creates a new session.
         * @param data - The session data.
         * @returns The created session.
         */
        async createSession(data) {
            const m = await getManager(c);
            const session = await m.save(SessionEntityName, data);
            return session;
        },
        /**
         * Gets a session and user by session token.
         * @param sessionToken - The session token.
         * @returns The session and user.
         */
        async getSessionAndUser(sessionToken) {
            const m = await getManager(c);
            const sessionAndUser = await m.findOne<AdapterSession & { user: AdapterUser }>(SessionEntityName, { where: { sessionToken }, relations: ["user"] });

            if (!sessionAndUser) return null;
            const { user, ...session } = sessionAndUser;
            return { session, user };
        },
        /**
         * Updates a session.
         * @param data - The session data.
         * @returns The updated session.
         */
        async updateSession(data) {
            const m = await getManager(c);
            await m.update(SessionEntityName, { sessionToken: data.sessionToken }, data);
            // TODO: Try to return?
            return null;
        },
        /**
         * Deletes a session.
         * @param sessionToken - The session token.
         * @returns The deleted session.
         */
        async deleteSession(sessionToken) {
            const m = await getManager(c);
            await m.delete(SessionEntityName, { sessionToken });
        },
        /**
         * Creates a new verification token.
         * @param data - The verification token data.
         * @returns The created verification token.
         */
        async createVerificationToken(data) {
            const m = await getManager(c);
            const verificationToken = await m.save(VerificationTokenEntityName, data);
            // @ts-expect-error - TypeORM doesn't have a type for this property
            delete verificationToken.id;
            return verificationToken;
        },
        /**
         * Uses a verification token.
         * @param identifier_token - The identifier and token.
         * @returns The used verification token.
         */
        // @ts-expect-error - TypeORM doesn't have a type for this property
        async useVerificationToken(identifier_token) {
            const m = await getManager(c);
            const verificationToken = await m.findOne(VerificationTokenEntityName, {
                where: identifier_token,
            });
            if (!verificationToken) {
                return null;
            }
            await m.delete(VerificationTokenEntityName, identifier_token);
            // @ts-expect-error - TypeORM doesn't have a type for this property
            delete verificationToken.id;
            return verificationToken;
        },
    };
}
