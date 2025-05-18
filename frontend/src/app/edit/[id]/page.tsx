"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import "./EditEmployee.css";

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    title: "",
    location: "",
    avatar: null as File | string | null,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const API_BASE =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.1.108:3000";
        const res = await fetch(`${API_BASE}/employees/${id}`);
        if (!res.ok) throw new Error("Failed to fetch employee");
        const data = await res.json();
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          department: data.department,
          title: data.title,
          location: data.location,
          avatar: data.avatar || null,
        });
      } catch (err) {
        setError((err as Error).message);
      }
    };
    fetchEmployee();
  }, [id]);

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
        if (key !== "avatar" && value) form.append(key, value as string);
      });

      if (formData.avatar instanceof File) {
        form.append("avatar", formData.avatar);
      } else if (formData.avatar === null) {
        form.append("removeAvatar", "true");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/employees/${id}`,
        {
          method: "PATCH",
          body: form,
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to update employee");
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
      <h1>Edit Employee</h1>
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
          {formData.avatar && typeof formData.avatar === "string" && (
            <div style={{ marginBottom: "8px" }}>
              <img
                src={formData.avatar}
                alt="Current avatar"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <button
                type="button"
                style={{
                  marginLeft: 12,
                  background: "#f87171",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "4px 10px",
                  cursor: "pointer",
                }}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, avatar: null }))
                }
              >
                Remove
              </button>
            </div>
          )}
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
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
