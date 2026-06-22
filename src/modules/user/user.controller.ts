import { Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        const user = await userService.createUserIntoDB(payload);

        res.status(httpStatus.CREATED).json({
          success: true,
          statusCode: httpStatus.CREATED,
          message: "User is successfully registered!",
          data: {
            user,
          },
        });
    } catch (error) {
        console.error(error)
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          statusCode: httpStatus.INTERNAL_SERVER_ERROR,
          message: "Oops, user fails to register!",
          error: (error as Error).message
        });
    }
};

export const userController = {
    createUser,
};
