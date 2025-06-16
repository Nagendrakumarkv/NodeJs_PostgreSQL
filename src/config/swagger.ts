export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Blog API",
    version: "1.0.0",
    description: "API documentation for the Blog application",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
    {
      url: "https://nodejs-postgresql-backend.onrender.com",
      description: "Production server",
    },
  ],
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            description: "The auto-generated id of the user",
          },
          name: {
            type: "string",
            description: "The name of the user",
          },
          email: {
            type: "string",
            description: "The email of the user",
          },
        },
      },
      Post: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            description: "The auto-generated id of the post",
          },
          title: {
            type: "string",
            description: "The title of the post",
          },
          content: {
            type: "string",
            description: "The content of the post",
          },
          userId: {
            type: "integer",
            description: "The id of the user who created the post",
          },
        },
      },
      Comment: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            description: "The auto-generated id of the comment",
          },
          content: {
            type: "string",
            description: "The content of the comment",
          },
          userId: {
            type: "integer",
            description: "The id of the user who created the comment",
          },
          postId: {
            type: "integer",
            description: "The id of the post the comment belongs to",
          },
        },
      },
    },
  },
  paths: {
    "/users": {
      get: {
        summary: "Get all users",
        tags: ["Users"],
        responses: {
          "200": {
            description: "A list of users",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/User",
                  },
                },
              },
            },
          },
          "500": {
            description: "Server error",
          },
        },
      },
      post: {
        summary: "Create a new user",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email"],
                properties: {
                  name: {
                    type: "string",
                  },
                  email: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
          "400": {
            description: "Invalid input",
          },
          "500": {
            description: "Server error",
          },
        },
      },
    },
    "/posts": {
      get: {
        summary: "Get all posts",
        tags: ["Posts"],
        responses: {
          "200": {
            description: "A list of posts",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Post",
                  },
                },
              },
            },
          },
          "500": {
            description: "Server error",
          },
        },
      },
      post: {
        summary: "Create a new post",
        tags: ["Posts"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "content", "userId"],
                properties: {
                  title: {
                    type: "string",
                  },
                  content: {
                    type: "string",
                  },
                  userId: {
                    type: "integer",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Post created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Post",
                },
              },
            },
          },
          "400": {
            description: "Invalid input",
          },
          "500": {
            description: "Server error",
          },
        },
      },
    },
    "/posts/{id}": {
      put: {
        summary: "Update a post",
        tags: ["Posts"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "content"],
                properties: {
                  title: {
                    type: "string",
                  },
                  content: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Post updated successfully",
          },
          "404": {
            description: "Post not found",
          },
          "500": {
            description: "Server error",
          },
        },
      },
      delete: {
        summary: "Delete a post",
        tags: ["Posts"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "204": {
            description: "Post deleted successfully",
          },
          "404": {
            description: "Post not found",
          },
          "500": {
            description: "Server error",
          },
        },
      },
    },
    "/comments": {
      get: {
        summary: "Get all comments",
        tags: ["Comments"],
        responses: {
          "200": {
            description: "A list of comments",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Comment",
                  },
                },
              },
            },
          },
          "500": {
            description: "Server error",
          },
        },
      },
      post: {
        summary: "Create a new comment",
        tags: ["Comments"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["content", "userId", "postId"],
                properties: {
                  content: {
                    type: "string",
                  },
                  userId: {
                    type: "integer",
                  },
                  postId: {
                    type: "integer",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Comment created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Comment",
                },
              },
            },
          },
          "400": {
            description: "Invalid input",
          },
          "500": {
            description: "Server error",
          },
        },
      },
    },
    "/comments/{id}": {
      put: {
        summary: "Update a comment",
        tags: ["Comments"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["content"],
                properties: {
                  content: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Comment updated successfully",
          },
          "404": {
            description: "Comment not found",
          },
          "500": {
            description: "Server error",
          },
        },
      },
      delete: {
        summary: "Delete a comment",
        tags: ["Comments"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "204": {
            description: "Comment deleted successfully",
          },
          "404": {
            description: "Comment not found",
          },
          "500": {
            description: "Server error",
          },
        },
      },
    },
  },
};
