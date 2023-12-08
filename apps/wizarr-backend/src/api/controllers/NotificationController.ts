import { BullMQ } from "@/bull";
import { Logger, LoggerInterface } from "@/decorators/LoggerDecorator";
import { ConnectedSocket, MessageBody, OnConnect, SocketController } from "socket-controllers";
import { Socket } from "socket.io";
import { Service } from "typedi";

@Service()
@SocketController("/notifications")
export class NotificationController {
    // Inject the logger.
    @Logger() private logger: LoggerInterface;

    constructor(private bullmq: BullMQ) {}

    @OnConnect()
    public connection(@ConnectedSocket() socket: Socket) {
        // Listen for the completed event from the notification worker.
        this.bullmq.getWorker("notifications").on("completed", (job) => {
            socket.emit("notification", {
                ...job.data,
            });
        });
    }
}
