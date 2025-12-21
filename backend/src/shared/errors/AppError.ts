export class AppError extends Error{
    constructor(
        public readonly message:string,
        public readonly statusCode=500
    ){
        super(message)
        Error.captureStackTrace(this,this.constructor)
    }
}
// captureStackTrace
//records where the error happened
// removes unnecessary internal stack lines
// makes debugging cleaner