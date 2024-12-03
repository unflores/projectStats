import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SideBar from "@/rcl/molecules/SideBar";
import prisma from "@/lib/db";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "App",
  description: "Some App",
};

const findProjects = async () => {
  const projects = await prisma.project.findMany({
    include: { analyses: true },
  });

  return projects.map(({ id, analyses, name }) => ({
    id,
    name,
    analyses: analyses.map(({ type }) => type),
  }));
};

const buildNav = (projects: Awaited<ReturnType<typeof findProjects>>) => {
  const navigation = projects.map(({ name, id }) => ({ name, href: `/projects/${id}/` }))
  return navigation.length === 0
    ? [{ name: "No projects" }]
    : navigation
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const projects = await findProjects();

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="z-40 min-h-screen md:flex md:relative">
          <SideBar navigation={buildNav(projects)} />

          <div className="relative flex-1 min-w-0">
            <main className="md:mt-0 md:ml-[160px] min-h-screen">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
