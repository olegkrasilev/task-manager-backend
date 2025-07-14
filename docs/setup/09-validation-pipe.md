---
# 📘 Global Validation and Transformation Setup in NestJS

This configuration ensures that incoming requests are properly validated, sanitized, and transformed into expected data structures before reaching your business logic.
---

## ✅ What Was Added

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    forbidUnknownValues: true,
  }),
);
```

---

## 🧩 Explanation of Each Option

| Option                 | Purpose                                                                  |
| ---------------------- | ------------------------------------------------------------------------ |
| `whitelist: true`      | Removes any properties that are **not explicitly defined** in the DTO.   |
| `forbidNonWhitelisted` | Throws an error when unknown properties are sent (helps catch mistakes). |
| `transform: true`      | Automatically transforms plain objects into **class instances**.         |
| `forbidUnknownValues`  | Ensures only valid types are passed; blocks `null`, `undefined`, etc.    |

---

## 🛡 Why This Matters

- **Security**: Prevents users from sending unexpected or malicious data.
- **Data integrity**: Ensures your services receive only clean, typed input.
- **Error transparency**: Clients receive clear validation error messages.
- **Readiness for decorators**: With `transform`, you can use methods like `.instanceof()` and handle dates, enums, etc.

---

## 🔧 Example Use Case

```ts
export class CreateUserDto {
  @IsEmail()
  email: string;

  @Length(6, 32)
  password: string;
}
```

With this global pipe configuration:

- Extra fields like `isAdmin: true` will be **automatically stripped**.
- Sending `isAdmin: true` will trigger a **400 Bad Request**.
- Input is **casted** to an instance of `CreateUserDto`.

---
