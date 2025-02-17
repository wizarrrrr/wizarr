import { InjectWorker } from "../../../decorators/InjectQueue";
import { ConnectedSocket, OnConnect, OnMessage, SocketController, SocketId } from "socket-controllers";
import { Service } from "typedi";

import type { BullMQ } from "../../../bull";
import type { Socket } from "socket.io";

@Service()
@SocketController("/notifications")
export class NotificationController {
    /**
     * Create a new instance of the NotificationController class.
     */
    constructor(@InjectWorker("notification") private notificationsWorker: BullMQ["workers"]["notification"]) {}

    @OnConnect()
    public connection(@ConnectedSocket() socket: Socket, @SocketId() id: string) {
        // Listen for the completed event from the notification worker.
        this.notificationsWorker.on("completed", (job) => {
            socket.emit("notification", {
                ...job.data,
            });
        });
        // Log the connection.
        console.log(`Client connected: ${id}`);
    }
}
