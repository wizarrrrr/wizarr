import { InjectWorker } from "../../decorators/InjectQueue";
import { ConnectedSocket, OnConnect, SocketController } from "socket-controllers";
import { Service } from "typedi";

import type { BullMQ } from "../../bull";
import type { Socket } from "socket.io";

@Service()
@SocketController("/notifications")
export class NotificationController {
    /**
     * Create a new instance of the NotificationController class.
     */
    constructor(@InjectWorker("notifications") private notificationsWorker: BullMQ["workers"]["notifications"]) {}

    @OnConnect()
    public connection(@ConnectedSocket() socket: Socket) {
        // Listen for the completed event from the notification worker.
        this.notificationsWorker.on("completed", (job) => {
            socket.emit("notification", {
                ...job.data,
            });
        });
    }
}
