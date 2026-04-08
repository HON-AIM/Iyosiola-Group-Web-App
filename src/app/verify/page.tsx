import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import crypto from "crypto";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const token = resolvedParams.token as string;
  const email = resolvedParams.email as string;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-red-600">
              <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h2>
          <p className="text-gray-600 mb-6">No verification token was provided.</p>
          <Link href="/register" className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition-colors">
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const verificationRecord = await prisma.verificationToken.findUnique({
    where: { 
      identifier_token: {
        identifier: email?.toLowerCase() || "",
        token: tokenHash,
      }
    },
  });

  if (!verificationRecord) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-red-600">
              <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h2>
          <p className="text-gray-600 mb-6">This verification link is invalid or has already been used.</p>
          <div className="space-y-3">
            <Link href="/register" className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition-colors">
              Create New Account
            </Link>
            <Link href="/login" className="block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-lg transition-colors">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (new Date() > verificationRecord.expires) {
    await prisma.verificationToken.delete({ 
      where: { identifier_token: { identifier: email.toLowerCase(), token: tokenHash } }
    });
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-orange-600">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Link Expired</h2>
          <p className="text-gray-600 mb-6">This verification link has expired. Please request a new one.</p>
          <Link href="/login" className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition-colors">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { email: verificationRecord.identifier },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.delete({ 
      where: { identifier_token: { identifier: email.toLowerCase(), token: tokenHash } }
    }),
  ]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-green-600">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
        <p className="text-gray-600 mb-6">Your email address has been successfully verified. You can now login to your account.</p>
        <Link href="/login" className="inline-block w-full bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition-colors">
          Login to Your Account
        </Link>
      </div>
    </div>
  );
}
