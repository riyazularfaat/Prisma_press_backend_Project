import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { IUser } from "./auth.interface";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwtUtils";

const loginUserIntoDB = async (payload: IUser) => {
    const { email, password } = payload;
    
    const user = await prisma.user.findUniqueOrThrow({
        where:{email}
    })
  
    if (user.activeStatus === "BLOCKED") {
      throw new Error("Your account has been blocked! Contact with support.");
    }


    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new Error("Password does not matched! Try again.")
    }

    const jwtPayload ={
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role        
    }

    const acessToken = jwtUtils.createToken(
      jwtPayload,
      config.jwt_access_secret,
      config.jwt_access_expires_secret as SignOptions
    );

    const refreshToken = jwtUtils.createToken(
      jwtPayload,
      config.jwt_refresh_secret,
      config.jwt_refresh_expires_secret as SignOptions
    );

    return {
      acessToken,
      refreshToken,
    };
}


export const authService = {
  loginUserIntoDB,
};