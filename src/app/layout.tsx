import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SideBar from "@/rcl/molecules/SideBar";
import type { Route } from "@/rcl/molecules/SideBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "App",
  description: "Some App",
};

const navigation: Route[] = [];
const Breadcrumbs = () => <></>;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative z-40 flex min-h-screen">
          <SideBar navigation={navigation} className="hidden lg:flex" />

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
