/* =====================================================================
   NGX POS & ERP — SQL Server seed reference
   Phase 1: one super-admin role + one admin user
   =====================================================================
   Mirrors: prisma/seed.ts

   IMPORTANT: bcrypt password hashing cannot be done in plain T-SQL.
   You must generate the password hash using the application itself
   (or any bcrypt tool) and paste it into @AdminPasswordHash below before
   running this script. Do NOT insert a plaintext password into
   PasswordHash under any circumstances.

   To generate a bcrypt hash using this project's own code:
     node -e "require('./src/modules/auth/password').hashPassword('YourPasswordHere').then(console.log)"
   (run from the repository root, with dependencies installed)
   ===================================================================== */

DECLARE @AdminRoleId NVARCHAR(50) = 'seed-role-admin';           -- replace with a real cuid if you have one
DECLARE @AdminUserId NVARCHAR(50) = 'seed-user-admin';           -- replace with a real cuid if you have one
DECLARE @AdminUsername NVARCHAR(100) = N'admin';
DECLARE @AdminEmail NVARCHAR(255) = N'admin@ngx.local';
DECLARE @AdminFullName NVARCHAR(200) = N'System Administrator';
DECLARE @AdminPasswordHash NVARCHAR(255) = N'REPLACE_WITH_A_REAL_BCRYPT_HASH';

IF NOT EXISTS (SELECT 1 FROM dbo.Roles WHERE Code = 'ADMIN')
BEGIN
    INSERT INTO dbo.Roles (Id, Code, Name, Description, IsSuperAdmin)
    VALUES (@AdminRoleId, 'ADMIN', 'Administrator',
            'Full system access. Bypasses granular permission checks.', 1);
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Email = N'admin@ngx.local')
BEGIN
    IF (SELECT COUNT(*) FROM dbo.Users WHERE Email = N'admin@ngx.local') = 0
       AND N'REPLACE_WITH_A_REAL_BCRYPT_HASH' = 'REPLACE_WITH_A_REAL_BCRYPT_HASH'
    BEGIN
        PRINT 'WARNING: You have not replaced the placeholder password hash.';
        PRINT 'Edit this script and set a real bcrypt hash before running the INSERT below.';
    END
END
GO

/* Uncomment and run after setting a real bcrypt hash above:

INSERT INTO dbo.Users (Id, Username, Email, PasswordHash, FullName, IsActive)
VALUES ('seed-user-admin', N'admin', N'admin@ngx.local',
        N'REPLACE_WITH_A_REAL_BCRYPT_HASH', N'System Administrator', 1);

INSERT INTO dbo.UserRoles (Id, UserId, RoleId)
VALUES ('seed-userrole-admin', 'seed-user-admin', 'seed-role-admin');

*/
