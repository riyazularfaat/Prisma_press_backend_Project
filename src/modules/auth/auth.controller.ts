import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sentResponse } from "../../utils/snedReponse";
import httpStatus from "http-status";
import { authService } from "./auth.service";

const userLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const { acessToken, refreshToken } =
    await authService.loginUserIntoDB(payload);


    res.cookie("accessToken", acessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7
    });

    sentResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User is successfully registered!",
      data: {
        acessToken,
        refreshToken,
      },
    });
  },
);

export const authController = {
  userLogin,
};