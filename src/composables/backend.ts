export interface IRequestResponse<T> {
    success: boolean
    data: T
    message?: string
}

export interface IRequestResult<T> {
    errorMsg?: string
    data: T | null
}
