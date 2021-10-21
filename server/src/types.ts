import { Request, Response } from "express";
import { Redis } from "ioredis";

interface SessionDataUser {
userId?: string
}

export type MyContext = {
    req: Request & {session: SessionDataUser}
    res: Response
    redis: Redis
};