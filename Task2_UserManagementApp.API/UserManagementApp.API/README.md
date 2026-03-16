# User Management API (C# ASP.NET Core)

## 1. Mô tả dự án
Dự án này là một RESTful API dùng để quản lý người dùng, được xây dựng bằng C# và ASP.NET Core Web API. Hệ thống tập trung vào việc tổ chức mã nguồn sạch sẽ, xử lý bảo mật mật khẩu và cung cấp tài liệu API minh bạch thông qua Swagger.

## 2. Công nghệ sử dụng
- **Framework:** .NET 10.0.
- **Database:** SQLite (Gọn nhẹ, không cần cài đặt server phức tạp).
- **ORM:** Entity Framework Core.
- **Security:** BCrypt.Net-Next (Mã hóa mật khẩu bằng kỹ thuật Hashing).
- **API Documentation:** Swagger (OpenAPI).

## 3. Kiến trúc hệ thống
Dự án được thiết kế theo mô hình tách lớp (Layered Architecture) và áp dụng triệt để Dependency Injection (DI) để đảm bảo tính mở rộng:
- **Controllers:** Tiếp nhận HTTP request và trả về response với đúng chuẩn HTTP Status Code.
- **Services:** Chứa logic nghiệp vụ (mã hóa mật khẩu, validate dữ liệu).
- **Repositories:** Quản lý giao tiếp trực tiếp với cơ sở dữ liệu.
- **DTOs:** Phân tách dữ liệu truyền tải, đảm bảo không bao giờ để lộ Password trong API response.

## 4. Các tính năng chính
- **CRUD Người dùng:** Tạo mới người dùng, xem danh sách người dùng, xem chi tiết người dùng theo ID, cập nhật thông tin và xóa người dùng.
- **Bảo mật mật khẩu:** Tự động mã hóa (hash) mật khẩu trước khi lưu vào cơ sở dữ liệu.
- **Xác thực dữ liệu:** Kiểm tra định dạng Email và đảm bảo Email là duy nhất trong hệ thống.
- **Tài liệu trực quan:** Tích hợp Swagger UI để kiểm thử API trực tiếp trên trình duyệt.

## 5. Hướng dẫn cài đặt
**Yêu cầu hệ thống**
- Đã cài đặt .NET 10 SDK.
- Công cụ lập trình: Visual Studio 2022/2026.

**Các bước khởi chạy:**
1. **Mở Project:** Mở file Solution `(.sln)` bằng Visual Studio.
2. **Cài đặt thư viện:** Hệ thống sẽ tự động khôi phục các gói NuGet (NuGet Restore) khi bạn Build project.
3. **Cấu hình Database:**
	- Khởi chạy Terminal.
	- Di chuyển tới thư mục chứa file dự án (file có đuôi .csproj) bằng lệnh `cd UserManagementApp.API`. Nếu đã ở thư mục có file dự án rồi thì bỏ qua.
	- Chạy lệnh `dotnet ef database update` để tạo database. Chạy lệnh ở thư mục chứa file dự án (file có đuôi .csproj)  (Nếu file `UserManagement.db` đã có sẵn, có thể bỏ qua bước này).
	- Nếu máy báo lỗi `Entity Framework Core .NET Command-line Tools is not installed` thì hãy chạy lệnh `dotnet tool install --global dotnet-ef` để cài đặt công cụ và chạy lại lệnh trên (nếu không báo lỗi thì bỏ qua bước này)
4. **Chạy dự án:** Nhấn F5 hoặc nút Start trong Visual Studio.

## 6. Tài liệu API
Sau khi dự án khởi chạy, trình duyệt sẽ tự động mở giao diện Swagger UI tại địa chỉ:

`http://localhost:<port>/swagger`

Tại đây, bạn có thể xem chi tiết các Endpoint, Request model và Response model cho từng chức năng quản lý người dùng.

**Dữ liệu kiểm thử:**

1. Request tạo mới người dùng (POST api/Users):
``` 
{
  "fullName": "Nguyen A",
  "email": "nguyena@example.com",
  "password": "12345678"
}
```
2. Response trả về (GET api/Users và api/Users/{id}):
	- api/Users không cần dữ liệu đầu vào
	- api/Users/{id} thì cần `id của người dùng`

3. Request cập nhật thông tin người dùng (PUT api/Users/{id})
	- Yêu cầu dữ liệu đầu vào là `id người dùng`
	- Các dữ liệu mới muốn cập nhật
	```
	{
	  "fullName": "Tên mới cho người dùng",
	  "email": "Email mới",
	  "password": "Mật khẩu mới"
	}
	```
4. Request xoá người dùng (DELETE api/Users/{id})
	- Yêu cầu dữ liệu đầu vào là `id người dùng`


## 7. Kiểm tra Database
**Nếu chưa cài đặt công cụ DB Browser for SQLite:**
- Truy cập trang `https://sqlitebrowser.org/dl/`.
- Tải về phiên bản **DB Browser for SQLite - Standard installer for 64-bit Windows**.
- Cài đặt công cụ lên máy.

**Đã cài đặt công cụ DB Browser for SQLite:**
- Mở công cụ.
- Nhấn chọn Open Database.
- Di chuyển đến thư mục chưa file database (`UserManagement.db` trong thư mục dự án) và mở lên.