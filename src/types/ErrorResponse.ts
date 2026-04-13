export type ErrorResponse = {
    success: boolean,
    message: string,
    data: Record<string, unknown>,
    error: ErrorObject
}

export type ErrorObject = {
    statusCode: number,
    message: string,
    name: string
}