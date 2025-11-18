import { Hono } from "hono";
import { CategoryController } from "./category.controller.js";

const categories = new Hono();

categories.post("/", CategoryController.createCategory);
categories.get("/", CategoryController.getAllCategories);
categories.get("/:id", CategoryController.getCategoryById);


export default categories;