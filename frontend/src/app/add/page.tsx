"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./AddEmployee.css";

export default function AddEmployeePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    title: "",
    location: "",
    avatar: null as File | null,
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, avatar: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) form.append(key, value);
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/employees`,
        {
          method: "POST",
          body: form,
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to create employee");
      }

      router.push("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Add New Employee</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="fieldRow">
          <div className="fieldGroup">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              className="input"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="fieldGroup">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              className="input"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="fieldGroup">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="fieldRow">
          <div className="fieldGroup">
            <label>Department</label>
            <select
              name="department"
              className="input"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="HR">HR</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          <div className="fieldGroup">
            <label>Title</label>
            <select
              name="title"
              className="input"
              value={formData.title}
              onChange={handleChange}
              required
            >
              <option value="">Select Title</option>
              <option value="Manager">Manager</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="Analyst">Analyst</option>
            </select>
          </div>
        </div>

        <div className="fieldGroup">
          <label>Location</label>
          <input
            type="text"
            name="location"
            className="input"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="fieldGroup">
          <label>Avatar</label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            className="input"
            onChange={handleFileChange}
          />
        </div>

        {error && <div className="form-error">{error}</div>}

        <button type="submit" className="form-submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Add Employee"}
        </button>
      </form>
    </div>
  );
}
