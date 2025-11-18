import { Hono } from "hono";
import { TagController } from "./tag.controller.js";

const tags = new Hono();

tags.post("/", TagController.createTag);
tags.get("/", TagController.getTags);
tags.get("/:id", TagController.getTagById);


export default tags;