import { CommentStatus } from "../../../generated/prisma/enums";

export interface ICreateCommentPayload{
    content: string;
    status: CommentStatus;
    postId: string;
}

export interface IUpdateCommentPayload {
  content: string;
  postId: string;
}
export interface IModerateCommentPayload {
  status: CommentStatus;
}