import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { IUser } from "./auth.interface";

const loginUserIntoDB = async (payload: IUser) => {
    const { email, password } = payload;
    
    const user = await prisma.user.findUniqueOrThrow({
        where:{email}
    })

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new Error("Password does not matched! Try again.")
    }
    return user;
}


export const authService = {
  loginUserIntoDB,
};