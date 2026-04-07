import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./db";
import bcrypt from "bcryptjs";

const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const email =
            typeof credentials?.email === "string"
              ? credentials.email.trim().toLowerCase()
              : "";
          const password =
            typeof credentials?.password === "string"
              ? credentials.password
              : "";

          if (!email || !password) {
            throw new Error("InvalidCredentials");
          }

          // ✅ Find user by email
          const user = await prisma.user.findUnique({
            where: { email },
            include: {
              loginAttempts: {
                where: {
                  success: false,
                  createdAt: {
                    gte: new Date(Date.now() - 15 * 60 * 1000), // Last 15 minutes
                  },
                },
              },
            },
          });

          // ✅ If user not found, reject immediately (don't leak info)
          if (!user) {
            console.warn("[SECURITY] Login attempt for non-existent email:", {
              email,
            });
            throw new Error("InvalidCredentials");
          }

          // ✅ Check if account is locked (5+ failed attempts in last 15 min)
          if (user.loginAttempts && user.loginAttempts.length >= 5) {
            console.warn("[SECURITY] Account locked due to failed attempts:", {
              email,
              attempts: user.loginAttempts.length,
            });
            throw new Error("TooManyAttempts");
          }

          // ✅ Verify email is verified
          if (!user.emailVerified) {
            console.warn("[SECURITY] Login attempt with unverified email:", {
              email,
            });
            throw new Error("EmailNotVerified");
          }

          // ✅ Verify account is not disabled
          if (!user.isActive) {
            console.warn("[SECURITY] Login attempt on disabled account:", {
              email,
            });
            throw new Error("AccountDisabled");
          }

          // ✅ Verify password
          if (
            !user.password ||
            !(await bcrypt.compare(password, user.password))
          ) {
            // Log failed attempt (user exists, so userId is valid FK)
            try {
              await prisma.loginAttempt.create({
                data: {
                  userId: user.id,
                  success: false,
                },
              });
            } catch (logError) {
              console.error("[ERROR] Failed to log login attempt:", logError);
            }

            console.warn("[SECURITY] Failed login attempt:", { email });
            throw new Error("InvalidCredentials");
          }

          // ✅ Clear failed login attempts on success
          try {
            await prisma.loginAttempt.deleteMany({
              where: {
                userId: user.id,
                success: false,
                createdAt: {
                  gte: new Date(Date.now() - 15 * 60 * 1000),
                },
              },
            });

            // Log successful login
            await prisma.loginAttempt.create({
              data: {
                userId: user.id,
                success: true,
              },
            });

            // Update last login timestamp
            await prisma.user.update({
              where: { id: user.id },
              data: { lastLogin: new Date() },
            });
          } catch (logError) {
            console.error("[ERROR] Failed to update login records:", logError);
            // Don't block login if logging fails
          }

          console.info("[AUDIT] Successful login:", {
            userId: user.id,
            email: user.email,
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "AuthenticationError";
          throw new Error(errorMessage);
        }
      },
    }),
  ],

  // ✅ Session configuration
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update every 24 hours
  },

  // ✅ Pages configuration
  pages: {
    signIn: "/login",
    error: "/login",
  },

  // ✅ Callbacks
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.email = user.email;
        token.role = ((user as { role?: string }).role || "USER") as
          | "USER"
          | "ADMIN";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },

  // ✅ Trust host for local dev
  trustHost: true,
});

export { handlers, auth, signIn, signOut };
