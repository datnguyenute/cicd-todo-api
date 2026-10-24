# todo-api

NestJS + Postgres (SQL thuần qua `pg`, không ORM).

| Endpoint | Mô tả |
|---|---|
| `GET /health` | `{ status, env, version, db }` — kiểm tra sau deploy |
| `GET /todos` | Danh sách todo |
| `POST /todos` `{ "title": "..." }` | Tạo todo |
| `PATCH /todos/:id/toggle` | Đảo trạng thái xong/chưa xong |

| Lệnh | Việc |
|---|---|
| `npm ci` | Cài đúng version trong `package-lock.json` |
| `npm test` | Unit test |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm run migrate` | Áp các file `migrations/*.sql` chưa chạy (cần `DATABASE_URL`) |
| `npm run start:dev` | Chạy dev, tự reload khi sửa code (đọc `.env`) |

| Biến môi trường | Ví dụ |
|---|---|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5434/todo_local` |
| `APP_ENV` | `dev` / `test` / `prod` |
| `APP_VERSION` | `1.0.0` (truyền lúc `docker build --build-arg`) |
| `CORS_ORIGINS` | `http://localhost:3001` |
| `PORT` | `8080` |

Hướng dẫn thực hành: [`../HUONG-DAN-LEVEL-1.md`](../HUONG-DAN-LEVEL-1.md)
