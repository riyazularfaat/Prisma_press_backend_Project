import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { jwtUtils } from "../../utils/jwtUtils";
import config from "../../config";
import { sendResponse } from "../../utils/sendReponse";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await userService.createUserIntoDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User is successfully registered!",
      data: {
        user,
      },
    });
  },
);

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const { accessToken } = req.cookies;

    // const verifiedToken = jwtUtils.verifiedToken(
    //   accessToken,
    //   config.jwt_access_secret,
    // );

    // if (typeof verifiedToken === "string") {
    //   throw new Error(verifiedToken);
    // }

    const profile = await userService.getMyProfileFromDb(req.user?.id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User is successfully registered!",
      data: { profile },
    });
  },
);

export const userController = {
  createUser,
  getMyProfile,
};
