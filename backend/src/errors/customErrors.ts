
export class DatabaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DatabaseError";
    }
}

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
    }
}

export class WrongVersionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "WrongVersionError";
    }
}