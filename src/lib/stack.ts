import { StackServerApp } from "@stackframe/stack";

if (!process.env.NEXT_PUBLIC_STACK_PROJECT_ID) {
  throw new Error("NEXT_PUBLIC_STACK_PROJECT_ID is not set");
}

if (!process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY) {
  throw new Error("NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY is not set");
}

// Instance pour le serveur uniquement
export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signIn: "/handler/signin",
    afterSignIn: "/dashboard",
    signUp: "/handler/signup",
    afterSignUp: "/dashboard",
    forgotPassword: "/handler/forgot-password",
    passwordReset: "/handler/password-reset",
    emailVerification: "/handler/email-verification",
  },
});

