🛒 NexCart — Multi-Vendor E-Commerce Platform

> A full-stack multi-vendor e-commerce platform built with **Java, Spring Boot, Spring Security, JWT, React, and MySQL**.

NexCart provides separate workflows for **Customers, Sellers, and Admins**, with secure authentication, role-based authorization, product and inventory management, cart operations, and order processing.

---

## ✨ Key Features

### 👤 Customer

- 🔐 User registration and JWT-based login
- 🛍️ Browse and search products
- 📦 View product details
- 🛒 Add, update, and remove cart items
- 🧾 Place orders
- 📋 View order history and order details
- 👤 View profile

### 🏪 Seller

- 📊 Seller dashboard
- ➕ Create products
- ✏️ Update products
- 🗑️ Delete products
- 📦 Manage inventory and product availability
- 📋 View seller-specific orders
- 🔍 View order details
- 🔄 Update order status

### 👑 Admin

- 📊 Admin dashboard
- 👥 Manage users and roles
- 📦 Manage products
- 🔎 Search products
- 🧾 Manage all orders
- 🔄 Update order status
- 📈 View platform statistics

---

## 🖥️ Application Screenshots

> Add screenshots of the running application here. Recommended screenshots:
>
> - Login / Register
> - Customer Home
> - Products
> - Product Details
> - Cart / Checkout
> - Customer Orders
> - Seller Dashboard
> - Seller Product Management
> - Seller Orders
> - Admin Dashboard
> - Admin Users / Products / Orders
> - Swagger API Documentation

Example:

```text
docs/
├── login.png
├── customer-home.png
├── products.png
├── cart.png
├── seller-dashboard.png
├── seller-products.png
├── admin-dashboard.png
└── swagger.png
```

After adding the images, they can be displayed like:

```markdown
![Login](docs/login.png)
```

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │     React + Vite    │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                              Axios
                               │
                           REST APIs
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Spring Boot     │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
       │Spring Security│ │ Controllers  │ │   Services   │
       │  JWT + RBAC  │ │              │ │              │
       └──────────────┘ └──────┬───────┘ └──────┬───────┘
                               │                │
                               └───────┬────────┘
                                       ▼
                              ┌────────────────┐
                              │ JPA / Hibernate│
                              └───────┬────────┘
                                      │
                                      ▼
                              ┌────────────────┐
                              │     MySQL      │
                              └────────────────┘
```

---

# 🔐 Authentication & Authorization

NexCart uses **Spring Security + JWT** for authentication and role-based access control.

### JWT Authentication Flow

```text
User
 ↓
Login
 ↓
AuthController
 ↓
AuthService
 ↓
Validate Credentials
 ↓
Generate JWT
 ↓
React Frontend
 ↓
Authorization: Bearer <JWT>
 ↓
JwtAuthenticationFilter
 ↓
Validate JWT
 ↓
Load UserDetails
 ↓
SecurityContext
 ↓
Role-Based Authorization
 ↓
Protected API
```

### Roles

```text
CUSTOMER
SELLER
ADMIN
```

Passwords are stored using **BCrypt hashing**, and the application uses **stateless JWT authentication**.

---

# 🛒 E-Commerce Flow

```text
Customer
   ↓
Browse Products
   ↓
Add Product to Cart
   ↓
Checkout
   ↓
Validate Stock
   ↓
Calculate Total
   ↓
Create Order
   ↓
Create Order Items
   ↓
Update Inventory
   ↓
Clear Cart
```

---

# 📦 Order Management

Orders follow a controlled lifecycle:

```text
PLACED
   ↓
CONFIRMED
   ↓
SHIPPED
   ↓
DELIVERED
```

Supported statuses:

```text
PLACED
CONFIRMED
SHIPPED
DELIVERED
CANCELLED
```

The backend validates order status transitions to prevent invalid state changes.

### Purchase-Time Pricing

Each `OrderItem` stores the **price at the time of purchase**, preserving historical pricing even if the product price changes later.

---

# 📦 Inventory Management

When an order is placed:

```text
Check Product Availability
          ↓
      Check Stock
          ↓
     Create Order
          ↓
   Reduce Quantity
          ↓
    Quantity = 0?
       /       \
     YES        NO
      ↓          ↓
Unavailable   Available
```

Products with existing order history are safely marked unavailable instead of being physically deleted, helping preserve historical order information.

---

# 🗄️ Database Design

MySQL is used as the primary relational database.

### Entity Relationships

```text
User
 │
 ├──────────────► Cart
 │                  │
 │                  └──► CartItem
 │                           │
 │                           └──► Product
 │
 └──────────────► Order
                    │
                    └──► OrderItem
                              │
                              └──► Product
```

### Main Tables

```text
users
products
carts
cart_items
orders
order_items
```

---

# 📁 Project Structure

```text
NexCart/
│
├── NexCart-backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/nexcart/
│   │   │   │   ├── config/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   ├── exception/
│   │   │   │   ├── repository/
│   │   │   │   ├── security/
│   │   │   │   └── service/
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application-example.properties
│   │   │
│   │   └── test/
│   │
│   ├── pom.xml
│   └── mvnw.cmd
│
├── nexcart-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── customer/
│   │   │   └── seller/
│   │   ├── routes/
│   │   └── services/
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

> `application.properties` is intentionally excluded from Git because it contains local database credentials and JWT secrets.

---

# 🛠️ Tech Stack

| Category        | Technologies            |
| --------------- | ----------------------- |
| Backend         | Java, Spring Boot       |
| Security        | Spring Security, JWT    |
| Frontend        | React, JavaScript, Vite |
| Database        | MySQL                   |
| ORM             | JPA, Hibernate          |
| API             | REST APIs               |
| Documentation   | Swagger / OpenAPI       |
| HTTP Client     | Axios                   |
| Routing         | React Router            |
| UI Icons        | Lucide React            |
| Build Tool      | Maven                   |
| Version Control | Git, GitHub             |

---

# 🌐 API Overview

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### User

```http
GET /api/users/me
```

### Products

```http
GET    /api/products
GET    /api/products/{id}

POST   /api/seller/products
PUT    /api/seller/products/{id}
DELETE /api/seller/products/{id}
```

### Customer Cart

```http
GET    /api/customer/cart
POST   /api/customer/cart
PUT    /api/customer/cart/{productId}
DELETE /api/customer/cart/{productId}
```

### Customer Orders

```http
POST /api/customer/orders
GET  /api/customer/orders
GET  /api/customer/orders/{orderId}
```

### Seller Orders

```http
GET /api/seller/orders
GET /api/seller/orders/{orderId}
PUT /api/seller/orders/{orderId}/status
```

### Admin

```http
GET    /api/admin/users
PUT    /api/admin/users/{userId}/role
DELETE /api/admin/users/{userId}

GET    /api/admin/products
DELETE /api/admin/products/{productId}

GET /api/admin/orders
PUT /api/admin/orders/{orderId}/status
```

---

# 📖 API Documentation

Swagger / OpenAPI documentation is available when the backend is running:

```text
http://localhost:8080/swagger-ui/index.html
```

JWT Bearer authentication can be configured directly through Swagger UI for protected APIs.

---

# ▶️ Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/GSandeepKumar396/NexCart.git
cd NexCart
```

## 2. Create MySQL Database

```sql
CREATE DATABASE nexcart;
```

## 3. Configure Backend

Create the local file:

```text
NexCart-backend/src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/nexcart
spring.datasource.username=root
spring.datasource.password=YOUR_DATABASE_PASSWORD

spring.jpa.hibernate.ddl-auto=update

jwt.secret=YOUR_JWT_SECRET
jwt.expiration=3600000
```

A safe template is provided as:

```text
application-example.properties
```

> ⚠️ Never commit your real database password, JWT secret, API keys, or other sensitive configuration.

## 4. Run Backend

```powershell
cd NexCart-backend
.\mvnw.cmd spring-boot:run
```

Backend:

```text
http://localhost:8080
```

## 5. Run Frontend

Open another terminal:

```powershell
cd nexcart-frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔒 Security Features

- 🔐 JWT-based authentication
- 🛡️ Spring Security
- 👥 Role-Based Access Control
- 🔑 BCrypt password hashing
- 🔒 Stateless authentication
- 🚫 401 Unauthorized handling
- ⛔ 403 Forbidden handling
- 🌐 CORS configuration
- ✅ Request validation
- 🧯 Global exception handling
- 🔐 Sensitive configuration excluded from Git

---

# 🧪 Tested Functionality

- ✅ Customer authentication
- ✅ Seller authentication
- ✅ Admin authentication
- ✅ JWT validation
- ✅ Role-based authorization
- ✅ Product CRUD operations
- ✅ Cart operations
- ✅ Order placement
- ✅ Inventory updates
- ✅ Seller order management
- ✅ Admin order management
- ✅ Order status transitions
- ✅ Swagger API testing
- ✅ Exception handling
- ✅ CORS configuration

---

# 🚧 Future Enhancements

- 🚦 Redis-based API Rate Limiting
- 💳 Real Payment Gateway Integration
- 📧 Email Notifications
- 🔔 Order Notifications
- ❤️ Wishlist
- ⭐ Product Reviews & Ratings
- 📊 Advanced Analytics
- 🚚 Delivery Tracking
- 🖼️ Cloud Image Storage
- 🔄 Refresh Token Authentication
- 🌐 Cloud Deployment

---

# 📊 Project Status

| Module                      | Status       |
| --------------------------- | ------------ |
| 🔐 Authentication           | ✅ Completed |
| 👥 Role-Based Authorization | ✅ Completed |
| 👤 Customer Module          | ✅ Completed |
| 🏪 Seller Module            | ✅ Completed |
| 👑 Admin Module             | ✅ Completed |
| 🛒 Cart Management          | ✅ Completed |
| 🧾 Order Management         | ✅ Completed |
| 📦 Inventory Management     | ✅ Completed |
| 🔒 JWT Security             | ✅ Completed |
| 📖 Swagger / OpenAPI        | ✅ Completed |
| 🚦 Redis Rate Limiting      | 🚧 Planned   |
| 💳 Payment Gateway          | 🚧 Planned   |

---

# 👨‍💻 Author

## G Sandeep Kumar

**B.Tech — Information Science and Engineering**

**Aspiring Java Full Stack Developer | Software Development Engineer**

### Core Skills

```text
Java • Spring Boot • Spring Security • JWT
React • JavaScript • REST APIs • MySQL
JPA • Hibernate • DSA • Git • GitHub
```

---

⭐ If you find this project useful, consider giving the repository a star!
