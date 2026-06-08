"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (data.success) {
      router.push("/admin/orders");
    } else {
      alert("Неверный пароль");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="border rounded-xl p-6 w-[300px]">
        <h1 className="text-2xl font-bold mb-4">
          🔐 Вход
        </h1>

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full p-2 rounded mb-4"
        />

        <button
          onClick={handleLogin}
          className="w-full border rounded p-2"
        >
          Войти
        </button>
      </div>
    </main>
  );
}