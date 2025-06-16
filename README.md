# Node.js TypeScript GraphQL API

This is a Node.js application built with TypeScript, Express, TypeORM, and GraphQL that provides a blog-like API with users, posts, and comments.

## Features

- GraphQL API endpoint at `/graphql`
- Interactive GraphiQL interface for testing queries
- REST API endpoints (legacy)
- Swagger documentation at `/api-docs`
- PostgreSQL database with TypeORM

## GraphQL Examples

### Queries

1. Get all users with their posts:
```graphql
query {
  users {
    id
    name
    email
    posts {
      id
      title
      content
    }
  }
}
```

2. Get a specific post with its comments:
```graphql
query {
  post(id: 1) {
    title
    content
    user {
      name
    }
    comments {
      content
      user {
        name
      }
    }
  }
}
```

### Mutations

1. Create a new user:
```graphql
mutation {
  addUser(name: "John Doe", email: "john@example.com") {
    id
    name
    email
  }
}
```

2. Create a new post:
```graphql
mutation {
  addPost(
    title: "My First Post"
    content: "Hello World!"
    userId: 1
  ) {
    id
    title
    content
    user {
      name
    }
  }
}
```

3. Add a comment:
```graphql
mutation {
  addComment(
    content: "Great post!"
    userId: 1
    postId: 1
  ) {
    id
    content
    user {
      name
    }
    post {
      title
    }
  }
}
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure your PostgreSQL database connection in `src/config/ormconfig.ts`

3. Run migrations:
```bash
npm run typeorm migration:run
```

4. Start the server:
```bash
npm run dev
```

5. Visit http://localhost:3000/graphql to access the GraphiQL interface

## API Documentation

- GraphQL API: http://localhost:3000/graphql
- Swagger REST API docs: http://localhost:3000/api-docs