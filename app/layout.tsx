import type { Metadata, Viewport } from 'next';
import React from 'react';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: "2U Tubelab - AI 기반 유튜브 분석 솔루션",
  description: "2U Tubelab은 AI 기반 유튜브 분석 솔루션을 통해 크리에이터의 성장을 지원합니다.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <div className="app-layout">
          {children}
        </div>
      </body>
    </html>
  );
}