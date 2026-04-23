import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const CredentialsSchema = z.object({
  email: z
    .string()
    .email()
    .trim()
    .toLowerCase(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
});

const nextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // ✅ Credentials provider (email/password)
    CredentialsProvider({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // ✅ Validate input
        const validation = CredentialsSchema.safeParse(credentials);

        if (!validation.success) {
          throw new Error("InvalidCredentials");
        }

        const { email, password, rememberMe } = validation.data;

        // ✅ Get client IP for logging
        const ip =
          req?.headers?.get("x-forwarded-for") ||
          req?.headers?.get("x-real-ip") ||
          "unknown";

        try {
          // ✅ Find user by email
          const user = await prisma.user.findUnique({
            where: { email },
            include: {
              loginAttempts: {
                where: {
                  createdAt: {
                    gte: new Date(Date.now() - 15 * 60 * 1000), // Last 15 minutes
                  },
                },
              },
            },
          });

          // ✅ Check if account is locked
          if (user?.loginAttempts && user.loginAttempts.length >= 5) {
            console.warn("[SECURITY] Account locked due to failed attempts:", {
              email,
              attempts: user.loginAttempts.length,
              ip,
            });
            throw new Error("TooManyAttempts");
          }

          // ✅ Verify email is verified
          if (!user?.emailVerified) {
            console.warn("[SECURITY] Login attempt with unverified email:", {
              email,
              ip,
            });
            await prisma.loginAttempt.create({
              data: {
                userId: user?.id || email,
                ipAddress: ip,
                userAgent: req?.headers?.get("user-agent"),
                success: false,
              },
            });
            throw new Error("EmailNotVerified");
          }

          // ✅ Verify account is active
          if (user && !user.isActive) {
            console.warn("[SECURITY] Login attempt on disabled account:", {
              email,
              ip,
            });
            await prisma.loginAttempt.create({
              data: {
                userId: user?.id || email,
                ipAddress: ip,
                userAgent: req?.headers?.get("user-agent"),
                success: false,
              },
            });
            throw new Error("AccountDisabled");
          }

          // ✅ Verify password
          if (!user?.password || !(await bcrypt.compare(password, user.password))) {
            // ✅ Log failed attempt
            await prisma.loginAttempt.create({
              data: {
                userId: user?.id || email,
                ipAddress: ip,
                userAgent: req?.headers?.get("user-agent"),
                success: false,
              },
            });

            console.warn("[SECURITY] Failed login attempt:", {
              email,
              ip,
            });

            throw new Error("InvalidCredentials");
          }

          // ✅ Clear failed login attempts on success
          await prisma.loginAttempt.deleteMany({
            where: {
              userId: user.id,
              success: false,
              createdAt: {
                gte: new Date(Date.now() - 15 * 60 * 1000),
              },
            },
          });

          // ✅ Log successful login
          await prisma.loginAttempt.create({
            data: {
              userId: user.id,
              ipAddress: ip,
              userAgent: req?.headers?.get("user-agent"),
              success: true,
            },
          });

          // ✅ Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: {
              lastLogin: new Date(),
            },
          });

          console.info("[AUDIT] Successful login:", {
            userId: user.id,
            email: user.email,
            ip,
            rememberMe,
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

    // ✅ Google OAuth provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: false,
    }),
  ],

  // ✅ Session configuration
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days default
    updateAge: 24 * 60 * 60, // Update every 24 hours
  },

  // ✅ JWT configuration
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // ✅ Pages configuration
  pages: {
    signIn: "/login",
    error: "/login",
    verifyRequest: "/verify-email",
    newUser: "/register",
  },

  // ✅ Callbacks
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = (user as { role?: string }).role;
      }

      if (account?.type === "credentials") {
        token.maxAge = 30 * 24 * 60 * 60;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "USER" | "ADMIN";
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(nextAuthOptions);
