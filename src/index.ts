import express, { Request, Response } from "express";
const cors = require("cors");
import { User } from "./entities/User";
import { Post } from "./entities/Post";
import { Comment } from "./entities/Comment";
import dataSource from "./config/ormconfig";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./config/swagger";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./graphql/schema";

const app = express();
const port = 3000;

app.use(express.json());

// Enable CORS for localhost:4200
// * => allow it from all domain
app.use(
  cors({
    //origin: process.env.FRONTEND_URL || "http://localhost:4200", // Allow only your Angular app
    origin: "*", // Allow only your Angular app
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow these methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
  })
);

// Initialize TypeORM DataSource
async function initializeDataSource() {
  try {
    await dataSource.initialize();
    console.log("Connected to PostgreSQL with TypeORM DataSource");
  } catch (err) {
    console.error("TypeORM DataSource error:", err);
    process.exit(1);
  }
}

initializeDataSource();

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP((req) => ({
    schema: schema,
    context: { dataSource },
    graphiql: true, // Enable GraphiQL interface for testing
  }))
);

// GET /users - Retrieve all users
app.get("/users", async (req: Request, res: Response) => {
  try {
    const userRepo = dataSource.getRepository(User);
    const users = await userRepo.find({ relations: ["posts", "comments"] });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// POST /users - Create a new user
app.post("/users", async (req: Request, res: any) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    const userRepo = dataSource.getRepository(User);
    const user = userRepo.create({ name, email });
    const savedUser = await userRepo.save(user);
    res.status(201).json(savedUser);
  } catch (err: any) {
    console.error(err);
    if (err.code === "23505") {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Database error" });
    }
  }
});

// GET /posts - Retrieve all posts
app.get("/posts", async (req: Request, res: Response) => {
  try {
    const postRepo = dataSource.getRepository(Post);
    const posts = await postRepo.find({ relations: ["user", "comments"] });
    res.json(posts);
  } catch (err: any) {
    console.error("getPosts error:", {
      message: err.message,
      stack: err.stack,
      code: err.code,
      detail: err.detail,
    });
    res.status(500).json({ error: "Database error", err });
  }
});

// POST /posts - Create a new post
app.post("/posts", async (req: Request, res: any) => {
  const { title, content, userId } = req.body;
  if (!title || !content || !userId) {
    return res
      .status(400)
      .json({ error: "Title, content, and userId are required" });
  }

  try {
    const userRepo = dataSource.getRepository(User);
    const postRepo = dataSource.getRepository(Post);
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const post = postRepo.create({ title, content, userId, user });
    const savedPost = await postRepo.save(post);
    res.status(201).json(savedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// PUT /posts/:id
app.put("/posts/:id", async (req: Request, res: any) => {
  const { id } = req.params;
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }
  try {
    const postRepo = dataSource.getRepository(Post);
    const post = await postRepo.findOne({ where: { id: Number(id) } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    post.title = title;
    post.content = content;
    const updatedPost = await postRepo.save(post);
    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE /posts/:id
app.delete("/posts/:id", async (req: Request, res: any) => {
  const { id } = req.params;
  try {
    const postRepo = dataSource.getRepository(Post);
    const post = await postRepo.findOne({ where: { id: Number(id) } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    await postRepo.remove(post);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// PUT /comments/:id
app.put("/comments/:id", async (req: Request, res: any) => {
  const { id } = req.params;
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }
  try {
    const commentRepo = dataSource.getRepository(Comment);
    const comment = await commentRepo.findOne({ where: { id: Number(id) } });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    comment.content = content;
    const updatedComment = await commentRepo.save(comment);
    res.json(updatedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE /comments/:id
app.delete("/comments/:id", async (req: Request, res: any) => {
  const { id } = req.params;
  try {
    const commentRepo = dataSource.getRepository(Comment);
    const comment = await commentRepo.findOne({ where: { id: Number(id) } });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    await commentRepo.remove(comment);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET /comments - Retrieve all comments
app.get("/comments", async (req: Request, res: Response) => {
  try {
    const commentRepo = dataSource.getRepository(Comment);
    const comments = await commentRepo.find({ relations: ["user", "post"] });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// POST /comments - Create a new comment
app.post("/comments", async (req: Request, res: any) => {
  const { content, userId, postId } = req.body;
  if (!content || !userId || !postId) {
    return res
      .status(400)
      .json({ error: "Content, userId, and postId are required" });
  }
  try {
    const userRepo = dataSource.getRepository(User);
    const postRepo = dataSource.getRepository(Post);
    const commentRepo = dataSource.getRepository(Comment);
    const user = await userRepo.findOne({ where: { id: userId } });
    const post = await postRepo.findOne({ where: { id: postId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const comment = commentRepo.create({ content, userId, postId, user, post });
    const savedComment = await commentRepo.save(comment);
    res.status(201).json(savedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
