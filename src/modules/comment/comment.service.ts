import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateCommentPayload, IModerateCommentPayload, IUpdateCommentPayload } from "./comment.interface";

const createComment = async (payload: ICreateCommentPayload, authorId: string) => {
    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId
        }
    })
    const result = await prisma.comment.create({
        data: {
            ...payload,
            authorId,
        },
    });

    return result;
};

const getCommentsByAuthorId = async (authorId: string) => {
    const result = await prisma.comment.findMany({
        where: {
            authorId,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                },
            },
        },
    });

    if (!result.length) {
        throw new Error("Comment not found!");
    }

    return result;
};

const getCommentByCommentId = async (commentId: string) => {
    const result = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId,
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views: true
                },
            },
        },
    });

    return result;
}

const updateComment = async (payload: IUpdateCommentPayload, authorId: string, commentId: string) => {
    const comment = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true
        }
    })

    if (!comment) {
        throw new Error("You provided invalid data.")
    }

    const updatedComment = await prisma.comment.update({
        where: {
            id: commentId
        },
        data: payload
    })

    return updatedComment;
}

const deleteComment = async (authorId: string, commentId: string, isAdmin: boolean) => {
    const comment = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId,
        },
    });

    if (!isAdmin && comment.authorId !== authorId) {
        throw new Error("You are not allowed to delete the comment.");
    }
    const deletedComment = await prisma.comment.delete({
        where: {
            id: commentId
        }
    })

    return deletedComment
};

const moderateByAdmin = async (payload: IModerateCommentPayload, commentId: string, isAdmin: boolean) => {
    const comment = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId
        },
        select: {
            id: true,
            status: true
        }
    })

    if (comment.status === payload.status) {
        throw new Error(`Your provided status ${payload.status} is already up to data.`)
    }

    const updateStatus = await prisma.comment.update({
        where: {
            id: commentId
        },
        data: payload
    })

    return updateStatus;
}

export const commentService = {
    createComment,
    getCommentsByAuthorId,
    getCommentByCommentId,
    updateComment,
    deleteComment,
    moderateByAdmin,
};
