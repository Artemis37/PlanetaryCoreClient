'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Layout } from "antd";
import CustomHeader from "../components/CustomHeader";
import CustomFooter from "../components/CustomFooter";
import AuthInitializer from "../components/AuthInitializer";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import "./globals.css";

const { Content } = Layout;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Provider store={store}>
          <AuthInitializer>
            <AntdRegistry>
              <Layout style={{ minHeight: '100vh' }}>
                <CustomHeader />
                <Content style={{ 
                  paddingTop: '64px', // Account for fixed header
                  minHeight: 'calc(100vh - 64px)' 
                }}>
                  {children}
                </Content>
                <CustomFooter />
              </Layout>
            </AntdRegistry>
          </AuthInitializer>
        </Provider>
      </body>
    </html>
  );
}
