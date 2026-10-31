
export class AppException extends Error {
    constructor(message, status = 400) {
        super(message);

        this.name = "AppException";
        this.status = status;
    }
}

