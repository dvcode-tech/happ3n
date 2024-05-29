import type { AppProps } from "next/app";
import "tailwindcss/tailwind.css";

import { Client, InternetIdentity } from "@bundly/ares-core";
import { IcpConnectContextProvider } from "@bundly/ares-react";
import HappenProvider from "@/context/HappenContext";
import { Toaster } from "@/components/ui/toaster";

export default function MyApp({ Component, pageProps }: AppProps) {
  const client = Client.create({
    restCanisters: {
      backend: {
        baseUrl: process.env.NEXT_PUBLIC_API_REST_URL!,
      },
    },
    providers: [
      new InternetIdentity({
        providerUrl: process.env.NEXT_PUBLIC_INTERNET_IDENTITY_URL!,
      }),
    ],
  });

  return (
    <IcpConnectContextProvider client={client}>
      <HappenProvider>
        <Component {...pageProps} />
      </HappenProvider>
      <Toaster />
    </IcpConnectContextProvider>
  );
}
