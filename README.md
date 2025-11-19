# Books Shop API

A full-featured RESTful API for managing an online bookstore. Built with modern technologies including Hono, PostgreSQL, Drizzle ORM, JWT authentication, and Redis caching.

## Features

- 📚 **Book Management** - Create, read, update, and delete books with categories and tags
- 👤 **User Management** - User registration, authentication, and profile management
- 🏷️ **Categories & Tags** - Organize books with categories and multiple tags
- 🔐 **JWT Authentication** - Secure endpoints with JSON Web Token authentication
- 💾 **PostgreSQL Database** - Robust data persistence with Drizzle ORM
- ⚡ **Redis Caching** - Performance optimization with Redis cache
- ✅ **Comprehensive Testing** - Unit and integration tests with Vitest
- 🛡️ **Input Validation** - Request validation using Zod schemas
- 🔒 **Password Hashing** - Secure password storage with bcrypt

## Tech Stack

- **Framework**: [Hono](https://hono.dev/) - Lightweight web framework
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Cache**: Redis
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Validation**: Zod
- **Testing**: Vitest with Supertest
- **Language**: TypeScript
- **Runtime**: Node.js with tsx for development

## Project Structure

```
src/
├── app.ts                 # Main application entry point
├── config/               # Configuration files
│   ├── db.ts            # Database connection
│   ├── env.ts           # Environment variables
│   └── redis.ts         # Redis configuration
├── db/                  # Database related
│   ├── createDatabase.ts
│   ├── migrations/      # Drizzle migrations
│   └── schema/          # Database schemas
│       ├── books.ts
│       ├── categories.ts
│       ├── tags.ts
│       └── users.ts
├── features/            # Feature modules
│   ├── auth/           # Authentication
│   ├── books/          # Books management
│   ├── categories/     # Categories management
│   ├── tags/           # Tags management
│   └── users/          # Users management
└── shared/             # Shared utilities
    ├── middleware/     # Custom middlewares
    └── utils/          # Helper functions

test/               # Test files
├── auth/           # Authentication test
├── books/          # Books management test
├── categories/     # Categories management test
├── tags/           # Tags management test
└── users/          # Users management test
```

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Redis (optional, for caching)
- npm or yarn package manager

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/Barkaaat/Books-Shop.git
cd "Books Shop"
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/books_shop
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_key
PORT=3000
NODE_ENV=development
```

4. **Initialize the database**
```bash
npm run drizzle:generate
npm run drizzle:migrate
```

## Running the Application

### Development
```bash
npm run dev
```
The server will start on `http://localhost:3000`

## Testing

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Users
- `GET /user` - Get user profile
- `PUT /user` - Update user profile
- `DELETE /user` - Delete user account

### Books
- `GET /book` - List all books
- `GET /book/:id` - Get book details
- `POST /book` - Create new book (admin)
- `PUT /book/:id` - Update book (admin)
- `DELETE /book/:id` - Delete book (admin)

### Categories
- `GET /categories` - List all categories
- `GET /categories/:id` - Get category details
- `POST /categories` - Create new category (admin)
- `PUT /categories/:id` - Update category (admin)
- `DELETE /categories/:id` - Delete category (admin)

### Tags
- `GET /tags` - List all tags
- `GET /tags/:id` - Get tag details
- `POST /tags` - Create new tag (admin)
- `PUT /tags/:id` - Update tag (admin)
- `DELETE /tags/:id` - Delete tag (admin)
