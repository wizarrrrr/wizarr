import { ConnectedSocket, MessageBody, OnConnect, OnMessage, SocketController } from "socket-controllers";
import { Server } from "socket.io";
import { Service } from "typedi";

@Service()
@SocketController("/jellyfin")
export class LoggingController {}
