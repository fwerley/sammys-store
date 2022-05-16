
import * as express from "express"

declare global {
    namespace Express {
        interface Request {
            user?: Record<string,any>
        }
    }
}

// declare namespace Express {
//     interface Request {
//         user: User
//     }
// }