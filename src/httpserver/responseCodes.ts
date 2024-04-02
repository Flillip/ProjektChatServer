export enum ResponseCode {
    // 200
    Success = 200,
    Created = 201,

    // 400
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    Conflict = 409,

    // 500
    InternalServerError = 500,
}