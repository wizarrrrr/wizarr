import WebSocket from "ws";

import { AlertTypes, NotificationContainer } from "./alert.types";
import { PlexServer } from "./server";

export class AlertListener {
    key = "/:/websockets/notifications";

    _ws?: WebSocket;

    constructor(
        private readonly server: PlexServer,
        public callback: (data: AlertTypes) => void,
    ) {}

    async run(): Promise<void> {
        const url = this.server.url(this.key, true).toString().replace("http", "ws");
        this._ws = new WebSocket(url);

        this._ws.on("message", (buffer: Buffer) => {
            try {
                const data: NotificationContainer<AlertTypes> = JSON.parse(buffer.toString());
                this.callback(data.NotificationContainer);
            } catch (err) {
                console.error(err);
            }
        });

        return new Promise((resolve) => {
            this._ws?.on("open", () => {
                resolve();
            });
        });
    }

    stop() {
        this._ws?.close();
    }
}
