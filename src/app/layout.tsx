import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const pixelId = process.env.FB_PIXEL_ID;

export const metadata: Metadata = {
  title: "Divoo",
  description: "Divoo, a transformative wellness brand with 11 years of expertise, has been dedicated to helping individuals restore balance in their mind, body, and chakras through aura scanning and healing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <head>
        {/* Facebook Pixel Script */}
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', ${pixelId});
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>

      <body className={inter.className}>{children}</body>
    </html>
  );
}
