import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} from "graphql";

// User Type
export const UserType: any = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args, context) {
        return context.dataSource
          .getRepository("Post")
          .find({ where: { userId: parent.id } });
      },
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent, args, context) {
        return context.dataSource
          .getRepository("Comment")
          .find({ where: { userId: parent.id } });
      },
    },
  }),
});

// Post Type
export const PostType: any = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    title: { type: GraphQLNonNull(GraphQLString) },
    content: { type: GraphQLNonNull(GraphQLString) },
    user: {
      type: UserType,
      resolve(parent, args, context) {
        return context.dataSource
          .getRepository("User")
          .findOne({ where: { id: parent.userId } });
      },
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent, args, context) {
        return context.dataSource
          .getRepository("Comment")
          .find({ where: { postId: parent.id } });
      },
    },
  }),
});

// Comment Type
export const CommentType = new GraphQLObjectType({
  name: "Comment",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    content: { type: GraphQLNonNull(GraphQLString) },
    user: {
      type: UserType,
      resolve(parent, args, context) {
        return context.dataSource
          .getRepository("User")
          .findOne({ where: { id: parent.userId } });
      },
    },
    post: {
      type: PostType,
      resolve(parent, args, context) {
        return context.dataSource
          .getRepository("Post")
          .findOne({ where: { id: parent.postId } });
      },
    },
  }),
});
