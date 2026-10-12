# MakeLoginApi v2 - User Management (Spring Boot + MySQL + HTML/CSS/JS)

Login/Register + admin dashboard. REST API me GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS sab methods.

## Run
1. MySQL chalu rakho.
2. `src/main/resources/application.properties` me `spring.datasource.password` badlo.
3. IntelliJ: File > Open > `pom.xml` > Open as Project. Maven load hone do.
4. `MakeLoginApiApplication` Run karo.
5. Browser: http://localhost:8080
6. Demo admin: `admin@nexus.com` / `Admin@123` (demo users ka password `User@123`)

Database `user_management_db` aur table `users` apne aap ban jate hain, aur pehli baar demo data bhi.

## API
| Method | URL | Kaam | Status |
|---|---|---|---|
| POST | /api/auth/register | register | 201 / 400 / 409 |
| POST | /api/auth/login | login | 200 / 400 / 401 / 403 |
| GET | /api/users | list (?search=&status=&role=) | 200 |
| GET | /api/users/stats | dashboard counts | 200 |
| GET | /api/users/{id} | ek user | 200 / 404 |
| HEAD | /api/users/{id} | exist check, body nahi | 200 / 404 |
| POST | /api/users | naya user | 201 / 400 / 409 |
| PUT | /api/users/{id} | poora update | 200 / 400 / 404 / 409 |
| PATCH | /api/users/{id} | partial update | 200 / 400 / 404 / 409 |
| DELETE | /api/users/{id} | delete | 200 / 404 |
| OPTIONS | /api/users | allowed methods | 200 |

Postman: `postman/MakeLoginApi.postman_collection.json` import karo.
