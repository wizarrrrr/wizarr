import { HttpError, KoaMiddlewareInterface, Middleware } from "routing-controllers";
import { Service } from "typedi";
import { Context } from "vm";

@Service()
@Middleware({ type: "before" })
export class CustomErrorHandler implements KoaMiddlewareInterface {
    /**
     * Handler that catches all errors and returns a JSON response
     * @param context
     * @param next
     * @returns
     */
    public async use(context: Context, next: (err?: any) => Promise<any>): Promise<any> {
        try {
            await next();
        } catch (error) {
            const response = this.handleErrorResponse(error);
            this.setContextResponse(context, response);
        }
    }

    /**
     * Handles the error response
     * @param error
     * @returns
     */
    private handleErrorResponse(error: any): Record<string, any> {
        const response = {
            success: false,
            status: error instanceof HttpError && error.httpCode ? error.httpCode : 500,
            message: error.message,
        } as Record<string, any>;

        if (response.status === 400) {
            response.errors = this.extractValidatorErrors(error);
        }

        if (error.stack && process.env.NODE_ENV === "development" && response.status === 500) {
            response.stack = error.stack;
        }

        return response;
    }

    /**
     * Extracts the validator errors from the error object
     * @param error
     * @returns
     */
    private extractValidatorErrors(error: any): Record<string, any> {
        const validatorErrors = {} as Record<string, any>;

        if (typeof error === "object" && error.hasOwnProperty("errors")) {
            error.errors.forEach((element: any) => {
                if (element.property && element.constraints) {
                    validatorErrors[element.property] = element.constraints;
                }
            });
        }

        return validatorErrors;
    }

    /**
     * Sets the response on the context
     * @param context
     * @param response
     */
    private setContextResponse(context: Context, response: Record<string, any>): void {
        context.status = response.status;
        context.body = response;
    }
}
