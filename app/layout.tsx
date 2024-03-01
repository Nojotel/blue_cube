"use client";
import { Provider } from "react-redux";
import store from "@/redux/store";
import Header from "@/components/Header/Header";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";

const nunito = Nunito({ subsets: ["latin"] });

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <Provider store={store}>
      <div className={`${nunito.className}`}>
        <Header />
        {children}
      </div>
    </Provider>
  );
}
