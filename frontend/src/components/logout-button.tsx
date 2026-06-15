"use client";

import { signOut } from "firebase/auth";
import { auth } from "../../firebase/auth";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);

    localStorage.removeItem("authenticated");
    localStorage.removeItem("email");

    router.replace("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition">
      Logout
    </button>
  );
}
