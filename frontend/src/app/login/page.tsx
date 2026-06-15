"use client";

import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "../../../firebase/auth";
import { ALLOWED_EMAILS } from "@/lib/allowed-emails";

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const email = result.user.email;

      const token = await result.user.getIdToken();

      localStorage.setItem("firebase_token", token);

      if (!email || !ALLOWED_EMAILS.includes(email)) {
        alert("Access denied");

        await auth.signOut();

        return;
      }

      localStorage.setItem("authenticated", "true");

      localStorage.setItem("email", email);

      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="bg-slate-900 p-8 rounded-xl border border-slate-700">
        <h1 className="text-3xl font-bold text-white mb-6">
          AI Meeting Intelligence
        </h1>

        <button
          onClick={handleGoogleLogin}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg">
          Sign In With Google
        </button>
      </div>
    </div>
  );
}
