import { AnalysisEnum } from "@/lib/analyses";
import db, { nukeDatabaseRecords } from "@/lib/db";

async function main() {
  if (process.env.NODE_ENV !== "development") {
    throw new Error("Seed should only be run in development.");
  }

  await nukeDatabaseRecords();
  const project = await db.project.create({
    data: {
      name: "PsiAnalyzer",
      analysis: {
        create: {
          type: AnalysisEnum.ReleaseCandidates,
          occurances: {
            create: [
              { externalId: "abc123", occurredAt: new Date("2024-01-01") },
              { externalId: "abc124", occurredAt: new Date("2024-01-01") },
              { externalId: "abc125", occurredAt: new Date("2024-01-15") },
              { externalId: "abc126", occurredAt: new Date("2024-02-01") },
            ],
          },
        },
      },
    },
    include: {
      analysis: {
        include: {
          _count: {
            select: {
              occurances: true,
            },
          },
        },
      },
    },
  });

  console.log("Created project: ", project.name);
  console.log(
    `With analysis of ${project.analysis[0].type} with ${project.analysis[0]._count.occurances} occurances`
  );
}

main()
  .then(() => {
    console.log("Seed completed");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
