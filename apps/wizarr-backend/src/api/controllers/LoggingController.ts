import { Logger, LoggerInterface } from "@/decorators/LoggerDecorator";
import { ConnectedSocket, MessageBody, OnConnect, OnMessage, SocketController } from "socket-controllers";
import { Server } from "socket.io";
import { Service } from "typedi";

@Service()
@SocketController("/jellyfin")
export class LoggingController {
    @Logger() private logger: LoggerInterface;

    @OnConnect()
    connect(@ConnectedSocket() socket: Server) {
        socket.emit("stdout", "test");
    }

    @OnMessage("stdout")
    async onMessage(@ConnectedSocket() socket: Server, @MessageBody() message: string) {
        // this.logger.o
    }
}
