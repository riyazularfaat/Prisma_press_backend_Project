import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwtUtils";
import config from "../../config";
import { sendResponse } from "../../utils/sendReponse";
import { userService } from "./user.service";
import httpStatus from "http-status";
import { Role } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";

const router = Router();

declare global{
    namespace Express {
        interface Request{
            user?: {
                id: string;
                name: string;
                email: string;
                role: string;
            }
        }
    } 
}

const auth = (...requiredRole: Role[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken

        if (!token) {
            throw new Error("You are not logged in! Please login to access this resource.")
        }

        const verifiedToken = jwtUtils.verifiedToken(
          token,
          config.jwt_access_secret,
        );

        if (!verifiedToken.success) {
            throw new Error(verifiedToken.error);
        }

        const { id, name, email, password, role } = verifiedToken.data as JwtPayload;
        if (!requiredRole.includes(role)) {
            res.status(httpStatus.FORBIDDEN).json({
                success: false,
                statusCode: httpStatus.FORBIDDEN,
                message:
                    "Forbidden! You don't have permission to access this resource.",
            });
        }
        const user = await prisma.user.findUnique({
            where: {
                id,
                name,
                email,
                role,
            }
        });

        if (!user) {
            throw new Error("User not found! You aren't logged in yet.")
        }
        if (user.activeStatus === "BLOCKED") {
            throw new Error("Your account has been blocked! Contact with support.");
        }

        req.user = {
            id,
            name,
            email,
            role,
        };

        next();

    })
}

router.post("/register", userController.createUser);
router.get("/me", auth(Role.ADMIN, Role.USER, Role.AUTHOR), userController.getMyProfile,
);


export const userRouter = router;