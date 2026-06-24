import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sentResponse } from "../../utils/snedReponse";
import httpStatus from "http-status";
import { authService } from "./auth.service";

const userLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const logInUser = await authService.loginUserIntoDB(payload);

    sentResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User is successfully registered!",
      data: {
        logInUser,
      },
    });
  },
);

export const authController = {
  userLogin,
};