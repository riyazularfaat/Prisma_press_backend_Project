import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePayload } from "./post.interface";

const createPost = async (payload: ICreatePostPayload, userId: string) => {
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

  if (!post) {
    throw new Error("Not Found!")
  }

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

const updatePost = async (postId: string, payload: IUpdatePayload, authorId: string, isAdmin: boolean) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId
    }
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the owner of the post.")
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
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
  return result;
}

const deletePost = async (postId: string, authorId: string, isAdmin: boolean) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the owner of the post.");
  }

  await prisma.post.delete({
    where: {
      id: postId
    }
  })
};

export const postService = {
  createPost,
  getAllPosts,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
};
