import { Middleware, MiddlewareInterface } from 'socket-controllers';
import { Socket } from 'socket.io';
import { authorizationTokenCheck } from '../../../middlewares/router/Authentication/AuthenticationCheck';
import { Service } from 'typedi';

@Service()
@Middleware({namespace: '/notifications'})
export class AuthenticationMiddleware implements MiddlewareInterface {
    async use(socket: Socket, next: ((err?: any) => any)) {
        // Authorize client check
        if (await authorizationTokenCheck(socket.handshake.headers.authorization ?? socket.handshake.auth["token"]).catch(() => console.log("\x1b[31m", "Unauthorized attempt to connect to websocket", "\x1b[0m"))) {
          console.log("test")  
          return next();
        }

        // Disconnect the client
        socket.disconnect(true);
    }
}