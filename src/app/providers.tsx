'use client'

import { StackProvider, StackClientApp } from "@stackframe/stack";
import * as Tooltip from '@radix-ui/react-tooltip';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Instance client séparée pour éviter les erreurs d'hydration
const stackClientApp = new StackClientApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signIn: "/handler/signin",
    afterSignIn: "/dashboard",
    signUp: "/handler/signup",
    afterSignUp: "/dashboard",
    emailVerification: "/handler/email-verification",
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Tooltip.Provider delayDuration={0}>
      <StackProvider app={stackClientApp}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </StackProvider>
    </Tooltip.Provider>
  );
}
