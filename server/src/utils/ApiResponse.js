// in the response we need to pass the status code , the data and the message
export class ApiResponse{
    constructor(statusCode,data, message="success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message 
        this.status = statusCode < 400
    }
}

