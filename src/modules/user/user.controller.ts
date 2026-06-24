import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sentResponse } from "../../utils/snedReponse";


const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const user = await userService.createUserIntoDB(payload);

  sentResponse(res,{
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User is successfully registered!",
    data: {
      user
    }
  });
})


export const userController = {
  createUser,
};
