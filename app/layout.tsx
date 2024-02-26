"use client";
import { Provider } from "react-redux";
import store from "@/redux/store";
import Header from "@/components/Header/Header";
import { Nunito } from "next/font/google";
import "./globals.css";
const nunito = Nunito({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body className={`${nunito.className}`}>
          <Header />
          {children}
        </body>
      </html>
    </Provider>
  );
}
