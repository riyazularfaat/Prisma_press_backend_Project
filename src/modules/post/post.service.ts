import { prisma } from "../../lib/prisma"
import { IPostPayload } from "./post.interface"

const createPost = async (payload: IPostPayload, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...payload,
            authorId: userId
        } 
    })

    return result;
}

const getAllPosts = async () => {
    const result = await prisma.post.findMany();

    return result;
}




export const postService = {
  createPost,
  getAllPosts,
};