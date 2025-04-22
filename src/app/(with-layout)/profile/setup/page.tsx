// pages/setup-profile.tsx
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SetupProfile() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    role: "",
    skills: "",
    goals: "",
    timeCommitment: "",
    vibe: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch("/api/profile", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    router.push("/"); // redirect to home after profile setup
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Role"
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
      />
      <input
        placeholder="Skills (comma separated)"
        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
      />
      <input
        placeholder="Goals"
        onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
      />
      <input
        placeholder="Time Commitment"
        onChange={(e) =>
          setFormData({ ...formData, timeCommitment: e.target.value })
        }
      />
      <input
        placeholder="Vibe"
        onChange={(e) => setFormData({ ...formData, vibe: e.target.value })}
      />
      <button type="submit">Save</button>
    </form>
  );
}
