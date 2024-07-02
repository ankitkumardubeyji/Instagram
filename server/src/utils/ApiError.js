
// custom class from throwing the customised exception
export class ApiError extends Error{
    constructor(statusCode, message="something went wrong",errors=[],stack=""){
        super(message)
        this.statusCode = statusCode;
        this.errors = errors;
        this.data = null;
        this.status = false;
    

    if(stack){
        this.stack = stack;
    }

    else{
        Error.captureStackTrace(this,this.constructor)
    }
}
}
