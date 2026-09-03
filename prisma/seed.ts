import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/modules/auth/password";

const prisma = new PrismaClient();

/**
 * Phase 1 seed: one super-admin role and one admin user for local
 * development/testing. Extend this incrementally as later phases add
 * companies, branches, and a real permission catalog -- do not front-load
 * demo data for modules that don't exist yet.
 */
async function main() {
  const adminRole = await prisma.role.upsert({
    where: { code: "ADMIN" },
    update: {},
    create: {
      code: "ADMIN",
      name: "Administrator",
      description: "Full system access. Bypasses granular permission checks.",
      isSuperAdmin: true,
    },
  });

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@ngx.local";
  const adminUsername = process.env.SEED_ADMIN_USERNAME ?? "admin";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

  const passwordHash = await hashPassword(adminPassword);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      username: adminUsername,
      email: adminEmail,
      fullName: "System Administrator",
      passwordHash,
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
    update: {},
    create: { userId: adminUser.id, roleId: adminRole.id },
  });

  console.log(`Seeded admin user: ${adminUsername} / ${adminEmail}`);
  console.log(
    `Password: ${adminPassword} (set SEED_ADMIN_PASSWORD env var to override before seeding)`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
