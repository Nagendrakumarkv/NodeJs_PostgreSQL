import express, { Request, Response } from "express";
import { User } from "./entities/User";
import { Post } from "./entities/Post";
import dataSource from "./config/ormconfig";

const app = express();
const port = 3000;

app.use(express.json());

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

// GET /users - Retrieve all users
app.get("/users", async (req: Request, res: Response) => {
  try {
    const userRepo = dataSource.getRepository(User);
    const users = await userRepo.find();
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
    const posts = await postRepo.find({ relations: ["user"] });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
