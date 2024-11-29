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
    include: { analysis: true },
  });

  return projects.map(({ id, analysis, name }) => ({
    id,
    name,
    analyses: analysis.map(({ type }) => type),
  }));
};


const Breadcrumbs = () => <></>;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const projects = await findProjects();

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative z-40 flex min-h-screen">
          <SideBar navigation={projects.map(({ name, id }) => ({ name, href: `/projects/${id}/` }))} className="hidden lg:flex" />

          <div className="relative flex-1 min-w-0">
            <main className="lg:mt-0 lg:ml-[180px] min-h-screen">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
