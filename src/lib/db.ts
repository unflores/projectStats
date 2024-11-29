import { PrismaClient } from "@prisma/client";
// See next.js prisma docs
// https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections#prismaclient-in-long-running-applications
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const nukeDatabaseRecords = async () => {
  if (!["development", "testing"].includes(process.env.NODE_ENV)) {
    console.error(
      "I'm about to nuke your db and you are over here running this on anything other than development?!"
    );
    process.exit(0);
  }

  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  // We can't delete any table with foreign key constraints.
  // So we have to handle the constrained table first
  const tablesWithConstraints = ["occurances", "analyses"].map((name) => ({ tablename: name }));
  const deleteStatements = [...tablesWithConstraints, ...tablenames]
    .map(({ tablename }) => tablename)
    .map((name) => `delete from "public"."${name}" CASCADE;`);

  try {
    await prisma.$transaction(async (prisma) => {
      for (const statement of deleteStatements) {
        await prisma.$executeRawUnsafe(statement);
      }
    });
  } catch (error) {
    console.log({ error });
  }
};

export default prisma;
