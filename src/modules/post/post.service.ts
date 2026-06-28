import { prisma } from "../../lib/prisma";
import { IPostPayload } from "./post.interface";

const createPost = async (payload: IPostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      isFeatured: payload.isFeatured ?? false,
      authorId: userId,
    },
  });

  return result;
};

const getAllPosts = async () => {
  const result = await prisma.post.findMany();

  return result;
};

const getPostById = async (postId: string) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  const updatedPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return updatedPost;
};

const getMyPosts = async (authorId: string) => {
  const posts = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return posts;
};

export const postService = {
  createPost,
  getAllPosts,
  getPostById,
  getMyPosts,
};
