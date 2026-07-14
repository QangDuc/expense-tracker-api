# 💰 Expense Tracker Pro

> Ứng dụng quản lý chi tiêu cá nhân — Dự án portfolio fullstack sử dụng **React / TypeScript** và **ASP.NET Core 8** theo kiến trúc Clean Architecture.

---

## 📖 Giới thiệu

**Expense Tracker Pro** là ứng dụng web giúp người dùng quản lý tài chính cá nhân một cách hiệu quả. Ứng dụng cung cấp các tính năng chính:

- **Quản lý giao dịch** — Theo dõi thu nhập và chi tiêu hàng ngày
- **Quản lý danh mục** — Phân loại giao dịch theo các nhóm tùy chỉnh
- **Quản lý ngân sách** — Thiết lập ngân sách hàng tháng cho từng danh mục
- **Dashboard tổng quan** — Biểu đồ thống kê trực quan về tình hình tài chính
- **Hồ sơ cá nhân** — Quản lý thông tin tài khoản người dùng
- **Xác thực bảo mật** — Đăng ký, đăng nhập với JWT và Refresh Token

---

## 🛠️ Công nghệ sử dụng

### Frontend

| Công nghệ | Phiên bản | Mô tả |
|---|---|---|
| **React** | 18.3 | Thư viện xây dựng giao diện người dùng |
| **TypeScript** | 5.6 | Ngôn ngữ lập trình chính (typed JavaScript) |
| **Vite** | 5.4 | Công cụ build và dev server hiện đại |
| **React Router DOM** | 6.27 | Điều hướng SPA (Single Page Application) |
| **Axios** | 1.7 | HTTP client gọi API |
| **Recharts** | 2.12 | Thư viện biểu đồ thống kê |
| **React Hook Form** | 7.53 | Quản lý form hiệu quả |
| **Zod** | 3.23 | Validation schema cho dữ liệu |
| **Framer Motion** | 12.42 | Animation và hiệu ứng chuyển động |
| **React Toastify** | 11.1 | Thông báo toast |
| **React Icons** | 5.7 | Bộ icon phong phú |

### Backend

| Công nghệ | Phiên bản | Mô tả |
|---|---|---|
| **ASP.NET Core** | 8.0 | Framework xây dựng REST API |
| **Entity Framework Core** | 8.0 | ORM truy xuất cơ sở dữ liệu |
| **SQL Server** | 2022 | Hệ quản trị cơ sở dữ liệu |
| **JWT Bearer** | 8.0 | Xác thực bằng JSON Web Token |
| **FluentValidation** | 11.11 | Validation dữ liệu đầu vào |
| **AutoMapper** | 13.0 | Ánh xạ đối tượng (DTO ↔ Entity) |
| **BCrypt.Net** | 4.0 | Mã hóa mật khẩu |
| **Serilog** | 8.0 | Ghi log có cấu trúc |
| **Swashbuckle** | 6.7 | Tạo tài liệu Swagger / OpenAPI |

### DevOps & Công cụ

| Công nghệ | Mô tả |
|---|---|
| **Docker & Docker Compose** | Container hóa ứng dụng |
| **Dockerfile** | Build image cho frontend và backend |

---

## 💻 Ngôn ngữ chính

| Ngôn ngữ | Vị trí | Vai trò |
|---|---|---|
| **TypeScript** | Frontend | Ngôn ngữ chính phát triển giao diện |
| **C#** | Backend | Ngôn ngữ chính phát triển API |
| **CSS** | Frontend | Thiết kế giao diện (Vanilla CSS) |
| **SQL** | Database | Truy vấn cơ sở dữ liệu (qua EF Core) |

---

## 🏗️ Kiến trúc hệ thống

Dự án được thiết kế theo mô hình **Clean Architecture**, tách biệt rõ ràng các tầng:

```
React (Frontend)  →  REST API  →  Application  →  Domain
                                                     ↑
                                              Infrastructure  →  SQL Server
```

- **Domain** — Không phụ thuộc vào tầng nào, chứa các Entity và Business Rule
- **Application** — Phụ thuộc Domain, chứa logic nghiệp vụ (Use Cases, DTOs, Validators)
- **Infrastructure** — Phụ thuộc Domain & Application, triển khai truy xuất dữ liệu
- **API** — Phụ thuộc Application & Infrastructure, tiếp nhận HTTP request

---

## 📁 Cấu trúc thư mục

```
ProjectCV/
│
├── 📂 backend/                          # Mã nguồn phía Server (.NET 8)
│   ├── 📂 ExpenseTracker.API/           # Tầng API — Controllers, Middleware, Cấu hình
│   │   ├── Controllers/                 #   Các API Controller
│   │   ├── Configurations/              #   Cấu hình DI, CORS, JWT
│   │   ├── Extensions/                  #   Extension methods
│   │   ├── Middleware/                   #   Middleware xử lý lỗi, xác thực
│   │   ├── Program.cs                   #   Entry point của ứng dụng
│   │   ├── appsettings.json             #   Cấu hình ứng dụng
│   │   └── Dockerfile                   #   Docker image cho API
│   │
│   ├── 📂 ExpenseTracker.Application/   # Tầng Application — Logic nghiệp vụ
│   │   ├── Common/                      #   Các lớp dùng chung
│   │   ├── DTOs/                        #   Data Transfer Objects
│   │   ├── Features/                    #   Use Cases (CQRS pattern)
│   │   ├── Interfaces/                  #   Abstractions / Contracts
│   │   ├── Mappings/                    #   AutoMapper Profiles
│   │   └── Validators/                  #   FluentValidation Rules
│   │
│   ├── 📂 ExpenseTracker.Domain/        # Tầng Domain — Entities & Business Rules
│   │   ├── Entities/                    #   Các thực thể (User, Transaction, ...)
│   │   ├── Enums/                       #   Enum (TransactionType, ...)
│   │   └── Exceptions/                  #   Custom Exceptions
│   │
│   ├── 📂 ExpenseTracker.Infrastructure/# Tầng Infrastructure — Triển khai Data Access
│   │   ├── Configurations/              #   EF Core Entity Configurations
│   │   ├── Identity/                    #   Xử lý JWT & Authentication
│   │   ├── Migrations/                  #   EF Core Migrations
│   │   ├── Persistence/                 #   DbContext
│   │   └── Repositories/               #   Repository Pattern
│   │
│   └── ExpenseTracker.sln               # Solution file
│
├── 📂 frontend/                         # Mã nguồn phía Client (React + TypeScript)
│   ├── 📂 src/
│   │   ├── 📂 components/              # Các component tái sử dụng
│   │   │   ├── 📂 ui/                  #   UI Components (Button, Card, Modal, ...)
│   │   │   ├── Navbar.tsx              #   Thanh điều hướng
│   │   │   ├── Header.tsx              #   Header
│   │   │   ├── Loading.tsx             #   Loading spinner
│   │   │   ├── ConfirmDialog.tsx       #   Dialog xác nhận
│   │   │   └── ...                     #   Các component khác
│   │   │
│   │   ├── 📂 pages/                   # Các trang chính
│   │   │   ├── DashboardPage.tsx       #   Trang tổng quan
│   │   │   ├── TransactionPage.tsx     #   Trang quản lý giao dịch
│   │   │   ├── CategoryPage.tsx        #   Trang quản lý danh mục
│   │   │   ├── BudgetPage.tsx          #   Trang quản lý ngân sách
│   │   │   ├── ProfilePage.tsx         #   Trang hồ sơ cá nhân
│   │   │   └── LoginPage.tsx           #   Trang đăng nhập
│   │   │
│   │   ├── 📂 routes/                  # Cấu hình routing
│   │   │   └── ProtectedRoute.tsx      #   Route bảo vệ (yêu cầu đăng nhập)
│   │   │
│   │   ├── 📂 services/                # Gọi API
│   │   │   └── api.ts                  #   Axios instance & interceptors
│   │   │
│   │   ├── 📂 styles/                  # CSS Design System
│   │   │   └── tokens.css              #   Design tokens (màu, font, spacing)
│   │   │
│   │   ├── 📂 types/                   # TypeScript type definitions
│   │   │   └── index.ts                #   Các interface & type
│   │   │
│   │   ├── 📂 utils/                   # Hàm tiện ích
│   │   │   ├── format.ts               #   Format ngày, tiền tệ
│   │   │   └── schemas.ts              #   Zod validation schemas
│   │   │
│   │   ├── App.tsx                      # Component gốc
│   │   ├── main.tsx                     # Entry point
│   │   └── vite-env.d.ts               # Vite type declarations
│   │
│   ├── index.html                       # HTML template
│   ├── package.json                     # Dependencies & scripts
│   ├── tsconfig.json                    # TypeScript config
│   ├── vite.config.ts                   # Vite config
│   └── Dockerfile                       # Docker image cho frontend
│
├── 📂 docs/                             # Tài liệu thiết kế
│   ├── 01-SRS.md                        # Đặc tả yêu cầu phần mềm
│   ├── 02-BusinessAnalysis.md           # Phân tích nghiệp vụ
│   ├── 03-DatabaseDesign.md             # Thiết kế cơ sở dữ liệu
│   ├── 04-ERD.md                        # Sơ đồ quan hệ thực thể
│   ├── 05-RestAPI.md                    # Thiết kế REST API
│   ├── 06-BackendArchitecture.md        # Kiến trúc Backend
│   ├── 07-EntityDesign.md               # Thiết kế Entity
│   ├── 08-Security.md                   # Bảo mật
│   ├── 09-Testing.md                    # Kiểm thử
│   └── 10-Roadmap.md                    # Lộ trình phát triển
│
├── 📂 tests/                            # Unit & Integration Tests
│   ├── ExpenseTracker.API.Tests/        # Test cho tầng API
│   └── ExpenseTracker.Application.Tests/# Test cho tầng Application
│
├── docker-compose.yml                   # Cấu hình Docker Compose
├── .gitignore                           # Danh sách file bỏ qua bởi Git
├── LICENSE                              # Giấy phép
└── README.md                            # Tài liệu hướng dẫn (file này)
```

---

## 🔌 API Endpoints

### Xác thực (Authentication)

| Phương thức | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/auth/register` | Đăng ký tài khoản mới |
| `POST` | `/auth/login` | Đăng nhập |
| `POST` | `/auth/refresh` | Làm mới Access Token |
| `POST` | `/auth/logout` | Đăng xuất |

### Tài nguyên bảo vệ (Yêu cầu đăng nhập)

| Phương thức | Endpoint | Mô tả |
|---|---|---|
| `GET/POST/PUT/DELETE` | `/categories` | CRUD danh mục |
| `GET/POST/PUT/DELETE` | `/transactions` | CRUD giao dịch |
| `GET/POST/PUT/DELETE` | `/budgets` | CRUD ngân sách |
| `GET` | `/dashboard` | Dữ liệu tổng quan |
| `GET/PUT` | `/profile` | Xem & cập nhật hồ sơ |

> 📝 Tài liệu API chi tiết có tại Swagger: `http://localhost:8080/swagger`

---

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (>= 18)
- [SQL Server](https://www.microsoft.com/sql-server) 2022
- [Docker](https://www.docker.com/) (tùy chọn)

### Cài đặt Backend

```bash
# 1. Cấu hình connection string và JWT key
#    Sửa file: backend/ExpenseTracker.API/appsettings.json

# 2. Restore dependencies
cd backend
dotnet restore

# 3. Tạo database migration
dotnet ef migrations add InitialCreate \
  --project ExpenseTracker.Infrastructure \
  --startup-project ExpenseTracker.API

# 4. Cập nhật database
dotnet ef database update \
  --project ExpenseTracker.Infrastructure \
  --startup-project ExpenseTracker.API

# 5. Chạy API server
dotnet run --project ExpenseTracker.API
# Swagger: http://localhost:8080/swagger
```

### Cài đặt Frontend

```bash
# 1. Cài đặt dependencies
cd frontend
npm install

# 2. Cấu hình API URL
#    Tạo file .env với nội dung: VITE_API_URL=http://localhost:8080

# 3. Chạy dev server
npm run dev
```

### Chạy Tests

```bash
cd backend
dotnet test
```

---

## 🐳 Docker

Chạy toàn bộ ứng dụng bằng Docker Compose:

```bash
docker compose up --build
```

| Service | Port | Mô tả |
|---|---|---|
| Frontend | `3000` | Giao diện web |
| API | `8080` | REST API server |
| SQL Server | `1433` | Cơ sở dữ liệu |

---
👨‍💻 Author
Nguyễn Quang Đức

GitHub: https://github.com/QangDuc

