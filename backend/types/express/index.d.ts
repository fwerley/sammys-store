
import * as express from "express"

type Data = {
    status: string
}

declare global {
    namespace Express {
        interface Request {
            user?: Record<string,any>;        
        }
    }
}
