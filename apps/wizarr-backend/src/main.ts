import "reflect-metadata";

import { createKoaServer, useContainer } from "routing-controllers";
import { LoggingMiddleware } from "./middlewares/LoggingMiddleware";
import { Connection } from "./data-source";
import { Container } from "typedi";

import http from "http";
import path from "path";
import socketIO from "socket.io";

import { Admins } from "./entities/admins.entity";
import { Roles } from "./entities/roles.entity";

const app = createKoaServer({
    routePrefix: "/api",
    controllers: [path.join(__dirname, "/controllers/**/*.js")],
    middlewares: [LoggingMiddleware],
});

const server = http.createServer(app.callback());
const io = new socketIO.Server(server, {
    cors: {
        origin: "*",
    },
    path: "/api/v1/socketio/",
});

useContainer(Container);

Connection.initialize().then(async () => {
    // const admin = new Admins();
    // admin.name = "Ashley Bailey";
    // admin.username = "admin";
    // admin.password = "Josephejb15@";
    // admin.email = "admin@wizarr.dev";
    // admin.role = await Connection.getRepository(Roles).findOne({ where: { role: "admin" } });
    // await Connection.getRepository(Admins).save(Connection.getRepository(Admins).create(admin));
});
server.listen(5001);
