import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { postController } from "./post.controller";

const router = Router();

router.get("/", postController.getAllPosts);
router.get("/:postId", postController.getSinglePost);
router.get("/stats", auth(Role.ADMIN) ,postController.postStats);
router.get("/my-posts",auth(Role.ADMIN, Role.USER, Role.AUTHOR), postController.getMyPosts);
router.post("/", auth(Role.ADMIN, Role.USER, Role.AUTHOR), postController.createPost);
router.patch("/:postId", auth(Role.ADMIN, Role.USER, Role.AUTHOR), postController.updatePost);
router.delete("/:postId", auth(Role.ADMIN, Role.USER, Role.AUTHOR), postController.deletePost);;


export const postRoutes = router;