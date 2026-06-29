import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";
import { sendResponse } from "../../utils/sendReponse";
import httpStatus from "http-status";

const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const payload = req.body

    const result = await commentService.createComment(payload, authorId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Comment Created Successfully!",
      data: result
    })
  },
);
const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId;
    const payload = req.body;
    const authorId = req.user?.id;

    const result = await commentService.updateComment(payload, authorId as string, commentId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Comment Updated Successfully!",
      data: result,
    });
  },
);
const moderateCommentByAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId;
    const isAdmin = req.user?.role == "ADMIN";
    const payload = req.body;

    const result = await commentService.moderateByAdmin(payload, commentId as string, isAdmin);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Comment Moderated Successfully!",
      data: result,
    });
  },
);
const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId;
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";

    const result = await commentService.deleteComment(authorId as string, commentId as string, isAdmin);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "The comment is deleted successfully!",
      data: result,
    });
  },
);

const getCommentById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId;

    const result = await commentService.getCommentByCommentId(commentId as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "The comment is retrived successfully!",
      data: result,
    });
  },
);
const getCommentByAuthorId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.params.authorId;

    const result = await commentService.getCommentsByAuthorId(authorId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment Retrived Successfully!",
      data: result,
    });
  },
);

export const commentController = {
  createComment,
  updateComment,
  deleteComment,
  getCommentById,
  getCommentByAuthorId,
  moderateCommentByAdmin,
};
