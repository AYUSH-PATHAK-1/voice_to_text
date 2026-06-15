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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_30%),radial-gradient(circle_at_center,rgba(14,165,233,0.10),transparent_36%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
      <div className="absolute left-1/4 top-16 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl transition-all duration-1000 ease-out animate-pulse" />
      <div className="absolute bottom-20 right-1/4 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl transition-all duration-1000 ease-out animate-pulse" />

      <div className="group relative z-10 w-full max-w-md transition-all duration-700 ease-out hover:-translate-y-1 hover:scale-[1.01]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-8 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-400/10 text-cyan-200 shadow-[0_0_35px_rgba(34,211,238,0.22)] transition-all duration-500 ease-out group-hover:rotate-6">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M4 8.5 20 15.5M20 8.5 4 15.5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.32em] text-cyan-200/70">
                Secure access
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Private AI meeting workspace
              </p>
            </div>
          </div>

          <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
            AI Meeting Intelligence
          </h1>
          <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
            Sign in to unlock intelligent meeting capture, insights, and team-ready summaries.
          </p>

          <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          <button
            onClick={handleGoogleLogin}
            className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:border-cyan-300/50 hover:shadow-2xl hover:shadow-cyan-500/25 active:translate-y-0 active:scale-[0.99]"
          >
            <svg className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5Z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.2 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7Z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.1 35.2 26.7 36 24 36c-5.2 0-9.6-3.2-11.3-7.8l-6.6 5.1C9.4 39.6 16.1 44 24 44Z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.5 5.6h.1l6.2 5.2C36.7 39.2 44 34 44 24c0-1.3-.1-2.3-.4-3.5Z" />
            </svg>
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">
              Sign In With Google
            </span>
          </button>

          <p className="mt-6 text-center text-xs text-slate-500">
            Authorized users only
          </p>
        </div>
      </div>
    </div>
  );
}
