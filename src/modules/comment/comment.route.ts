import { Router } from "express";
import { commentController } from "./comment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/author/:authorId", commentController.getCommentByAuthorId);
router.get("/:commentId", commentController.getCommentById);
router.post("/",auth(Role.ADMIN, Role.USER, Role.AUTHOR), commentController.createComment);
router.patch("/:commentId",auth(Role.ADMIN,Role.USER, Role.AUTHOR), commentController.updateComment);
router.patch("/:commentId/moderate", auth(Role.ADMIN), commentController.moderateCommentByAdmin);
router.delete("/:commentId",auth(Role.ADMIN, Role.USER, Role.AUTHOR),commentController.deleteComment);


export const commentRoutes = router;