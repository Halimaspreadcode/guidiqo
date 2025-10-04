'use client'

import { StackProvider, StackClientApp } from "@stackframe/stack";
import * as Tooltip from '@radix-ui/react-tooltip';

// Instance client séparée pour éviter les erreurs d'hydration
const stackClientApp = new StackClientApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signIn: "/handler/signin",
    afterSignIn: "/dashboard",
    signUp: "/handler/signup",
    afterSignUp: "/dashboard",
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Tooltip.Provider delayDuration={0}>
      <StackProvider app={stackClientApp}>
        {children}
      </StackProvider>
    </Tooltip.Provider>
  );
}
