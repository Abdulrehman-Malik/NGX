# Connecting to SQL Server (for the db-scripts/sqlserver mirror)

This is **not** required to run the application — the app uses PostgreSQL
via Prisma (see the root `HOW_TO_RUN.txt` / `README.md` for that). This
file is only for teams running the parallel SQL Server schema mirror in
`db-scripts/sqlserver/` for portability testing or evaluation.

## Option A — Run SQL Server locally with Docker (easiest)

1. Pull and run the official Microsoft image:

   ```bash
   docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong!Passw0rd" \
     -p 1433:1433 --name ngx-sqlserver \
     -d mcr.microsoft.com/mssql/server:2022-latest
   ```

   Replace `YourStrong!Passw0rd` with your own password — SQL Server
   requires at least 8 characters including uppercase, lowercase, a digit,
   and a symbol.

2. Wait about 15–20 seconds for it to finish starting up.

3. Create the database (one time):

   ```bash
   docker exec -it ngx-sqlserver /opt/mssql-tools18/bin/sqlcmd \
     -S localhost -U sa -P "YourStrong!Passw0rd" -C \
     -Q "CREATE DATABASE ngx_pos_erp"
   ```

## Option B — Connect to an existing SQL Server instance

You'll need: server hostname/IP, port (default `1433`), a login
(username/password or Windows auth), and a database name.

## Running the scripts

From the repository root, using `sqlcmd` (bundled with the Docker image
above, or installable separately):

```bash
docker exec -it ngx-sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "YourStrong!Passw0rd" -C \
  -d ngx_pos_erp -i /path/to/db-scripts/sqlserver/001_init_auth.sql
```

Or, if `sqlcmd` is installed directly on your machine (not in Docker):

```bash
sqlcmd -S localhost,1433 -U sa -P "YourStrong!Passw0rd" -C \
  -d ngx_pos_erp -i db-scripts/sqlserver/001_init_auth.sql
```

Prefer a GUI? [Azure Data Studio](https://azure.microsoft.com/products/data-studio)
or SQL Server Management Studio (Windows only) can open and run `.sql`
files directly — connect using the same server/username/password, open
the file, and click "Run".

## Connection string format (for reference)

If any tooling ever needs a connection string for this database, the
standard ADO.NET-style format is:

```
Server=localhost,1433;Database=ngx_pos_erp;User Id=sa;Password=YourStrong!Passw0rd;Encrypt=true;TrustServerCertificate=true;
```

This project's own `.env` file does **not** currently have a SQL Server
variable — `DATABASE_URL` in `.env.example` is Postgres-specific and used
by Prisma. If SQL Server support is ever added to the running application
(not just this reference schema), document the new environment variable
here and in `.env.example` at that time.

## Verifying the tables were created

```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo';
```

You should see `Users`, `Roles`, `Permissions`, `RolePermissions`,
`UserRoles`, `Sessions` after running `001_init_auth.sql`.
