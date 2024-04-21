import {NextFunction, Request, Response} from "express";
import {DecodedIdToken} from "firebase-admin/auth";
import Client from "../types/Client";
import {logger} from "../logger";
import {app} from "../app";


declare global {
    namespace Express {
        interface Request {
            client?: Client;
        }
    }
}

async function getByToken(idToken: string): Promise<[Client | null, Error | null]> {
    try {

        const admin = app.auth


        const decodedToken: DecodedIdToken = await admin.verifyIdToken(idToken, true)


        const googleUser = await admin.getUser(decodedToken.uid)


        const client: Client = {
            id: googleUser.uid,
            userName: googleUser.displayName!,
            email: googleUser.email!,
            token: idToken
        }

        return [client, null]
    } catch (err: any) {
        return [null, err]
    }
}

const getAuth = (optional: boolean) => async (req: Request, res: Response, next: NextFunction) => {
    try {

        // req.client = {
        //     id: "test",
        //     userName: "Test",
        //     email: "test@test.test",
        //     imgUrl: "img.com/1",
        //     token: "123456787"
        // }
        //
        // return next()

        const authorization = req.header("Authorization");

        if (!authorization) {

            if (optional) {
                return next()
            } else {
                return res.sendStatus(401)
            }

        }


        const token = authorization.split(" ")[1];

        if (!token) {
            if (optional) {
                return next()
            } else {
                return res.sendStatus(401)
            }
        }

        if (!token) return res.sendStatus(401);

        const [client, error] = await getByToken(token)


        if (!client && optional) {
            return next()
        }


        if (!client) {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
            logger.error(`Unauthorized api request (Path: ${req.path}, IP: ${ip})`)
            return res.status(401).json({error: "Unauthorized"})
        }

        if (error) {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
            logger.error(`Unauthorized api request (Path: ${req.path}, IP: ${ip})`)
            return res.status(401).json({error: error.message})
        }


        req.client = client

        next();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}


export const authOptional = getAuth(true)


export const auth = getAuth(false)

