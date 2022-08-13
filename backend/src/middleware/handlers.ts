import HttpException from "../common/http-exception";
import {NextFunction, Request, Response} from "express";

export const errorLogger = (
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction) => {
    console.log(`error ${error.message}`)
    next(error)
}

export const errorResponder = (
    error: HttpException,
    request: Request,
    response: Response) => {
    response.header("Content-Type", 'application/json')

    const status = error.statusCode || 400
    response.status(status).send(error.message)
}

export const invalidPathHandler = (
    request: Request,
    response: Response) => {
    response.status(404)
    response.send('invalid path')
}

export const requestLogger = (
    request: Request,
    response: Response,
    next: NextFunction) => {

    console.log(`${request.method} url:: ${request.url} :: %${JSON.stringify(request.body)}`);
    next()
}
