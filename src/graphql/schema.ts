import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} from "graphql";
import { UserType, PostType, CommentType } from "./types";
import { User } from "../entities/User";
import { Post } from "../entities/Post";
import { Comment } from "../entities/Comment";

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLInt } },
      resolve(parent, args, context) {
        return context.dataSource.getRepository(User).findOne({
          where: { id: args.id },
          relations: ["posts", "comments"],
        });
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args, context) {
        return context.dataSource.getRepository(User).find({
          relations: ["posts", "comments"],
        });
      },
    },
    post: {
      type: PostType,
      args: { id: { type: GraphQLInt } },
      resolve(parent, args, context) {
        return context.dataSource.getRepository(Post).findOne({
          where: { id: args.id },
          relations: ["user", "comments"],
        });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args, context) {
        return context.dataSource.getRepository(Post).find({
          relations: ["user", "comments"],
        });
      },
    },
    comment: {
      type: CommentType,
      args: { id: { type: GraphQLInt } },
      resolve(parent, args, context) {
        return context.dataSource.getRepository(Comment).findOne({
          where: { id: args.id },
          relations: ["user", "post"],
        });
      },
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent, args, context) {
        return context.dataSource.getRepository(Comment).find({
          relations: ["user", "post"],
        });
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args, context) {
        const userRepo = context.dataSource.getRepository(User);
        const user = userRepo.create({ name: args.name, email: args.email });
        return await userRepo.save(user);
      },
    },
    addPost: {
      type: PostType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(parent, args, context) {
        const postRepo = context.dataSource.getRepository(Post);
        const userRepo = context.dataSource.getRepository(User);

        const user = await userRepo.findOne({ where: { id: args.userId } });
        if (!user) throw new Error("User not found");

        const post = postRepo.create({
          title: args.title,
          content: args.content,
          userId: args.userId,
          user: user,
        });
        return await postRepo.save(post);
      },
    },
    addComment: {
      type: CommentType,
      args: {
        content: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLInt) },
        postId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(parent, args, context) {
        const commentRepo = context.dataSource.getRepository(Comment);
        const userRepo = context.dataSource.getRepository(User);
        const postRepo = context.dataSource.getRepository(Post);

        const user = await userRepo.findOne({ where: { id: args.userId } });
        if (!user) throw new Error("User not found");

        const post = await postRepo.findOne({ where: { id: args.postId } });
        if (!post) throw new Error("Post not found");

        const comment = commentRepo.create({
          content: args.content,
          userId: args.userId,
          postId: args.postId,
          user: user,
          post: post,
        });
        return await commentRepo.save(comment);
      },
    },
    updatePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
      },
      async resolve(parent, args, context) {
        const postRepo = context.dataSource.getRepository(Post);
        const post = await postRepo.findOne({ where: { id: args.id } });
        if (!post) throw new Error("Post not found");

        if (args.title) post.title = args.title;
        if (args.content) post.content = args.content;

        return await postRepo.save(post);
      },
    },
    deletePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(parent, args, context) {
        const postRepo = context.dataSource.getRepository(Post);
        const post = await postRepo.findOne({ where: { id: args.id } });
        if (!post) throw new Error("Post not found");

        await postRepo.remove(post);
        return post;
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
