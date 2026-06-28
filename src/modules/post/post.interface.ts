import { PostStatus } from "../../../generated/prisma/enums";

export interface ICreatePostPayload {
  title: string,
  content: string,
  thumbnail?: string,
  isFeatured?: boolean,
  status: PostStatus,
  tags: string[],
  views: number
}

export interface IUpdatePayload {
  title?: string;
  content?: string;
  thumbnail?: string;
  isFeatured?: boolean;
  status?: PostStatus;
  tags?: string[];
  views?: number;
}
