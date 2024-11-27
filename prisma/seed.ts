import db from "@/lib/db";

async function main() {
  if (process.env.NODE_ENV !== "development") {
    throw new Error("Seed should only be run in development.");
  }

  const project = await db.project.create({
    data: {
      name: "PsiAnalyzer",
      analysis: {
        create: {
          type: "releaseCandidates",
          occurances: {
            create: [
              { occurredAt: new Date("2024-01-01") },
              { occurredAt: new Date("2024-01-01") },
              { occurredAt: new Date("2024-01-15") },
              { occurredAt: new Date("2024-02-01") },
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
