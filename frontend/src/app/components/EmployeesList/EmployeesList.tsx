"use client";

import { useEffect, useState } from "react";
import EmployeeCard from "../EmployeeCard/EmployeeCard";
import "./EmployeesList.css";
import Link from "next/link";

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  department: string;
  location: string;
  avatar?: string;
}

interface ApiResponse {
  data: Employee[];
  total: number;
}

interface FilterOptions {
  department: string[];
  title: string[];
  location: string[];
}

interface EmployeeListProps {
  setLoading: (loading: boolean) => void;
}

function EmployeeList({ setLoading }: EmployeeListProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [loadedPages, setLoadedPages] = useState<number[]>([]);

  const [filterType, setFilterType] = useState<
    "department" | "title" | "location"
  >("department");
  const [filterValue, setFilterValue] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    department: [],
    title: [],
    location: [],
  });

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.1.108:3000";

  const fetchFilterOptions = async () => {
    try {
      const res = await fetch(`${API_BASE}/employees/filter-options`);
      const data = await res.json();
      setFilterOptions({
        department: data.department.sort(),
        title: data.title.sort(),
        location: data.location.sort(),
      });
    } catch (error) {
      console.error("Failed to fetch filter options:", error);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, [API_BASE]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (searchTerm.trim()) params.append("search", searchTerm.trim());
      if (filterValue !== "All") params.append(filterType, filterValue);

      try {
        const res = await fetch(`${API_BASE}/employees?${params.toString()}`);
        const result: ApiResponse = await res.json();
        setEmployees(result.data);
        setTotal(result.total);

        if (!loadedPages.includes(page)) {
          setLoadedPages((prev) => [...prev, page]);
        }
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [page, searchTerm, filterType, filterValue, setLoading, API_BASE]);

  const totalPages = Math.ceil(total / limit);

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      const res = await fetch(`${API_BASE}/employees/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete employee");

      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
      setFilterValue("All");
      setFilterType("department");
      setSearchTerm("");
      setPage(1);
      fetchFilterOptions();
    } catch (error) {
      alert("Error deleting employee: " + (error as Error).message);
    }
  };

  return (
    <div className="employee-directory">
      <div className="directory-header">
        <div className="directory-controls">
          <h1 className="directory-title">Employees</h1>
          <div className="directory-actions">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="search-bar"
              />
            </div>

            <div className="filter-container">
              <span className="filter-label">Filter by:</span>

              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(
                    e.target.value as "department" | "title" | "location"
                  );
                  setFilterValue("All");
                  setPage(1);
                }}
                className="filter-select"
              >
                <option value="department">Department</option>
                <option value="title">Title</option>
                <option value="location">Location</option>
              </select>

              <select
                value={filterValue}
                onChange={(e) => {
                  setFilterValue(e.target.value);
                  setPage(1);
                }}
                className="filter-value-select"
              >
                <option value="All">All Titles</option>
                {filterOptions[filterType].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <button
                className="reset-filters-btn"
                onClick={() => {
                  setFilterType("department");
                  setFilterValue("All");
                  setSearchTerm("");
                  setPage(1);
                }}
              >
                Reset
              </button>
            </div>

            <div className="view-toggle">
              <button
                className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <img className="grid-icon" src="/grid.svg" alt="Grid View" />
              </button>
              <button
                className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <img className="list-icon" src="/list.svg" alt="List View" />
              </button>
            </div>

            <Link href="/add" className="add-employee-btn">
              <span className="plus-icon">+</span>
              Add Employee
            </Link>
          </div>
        </div>
      </div>

      <div
        className={`employees-container ${
          viewMode === "list" ? "list-view" : "grid-view"
        }`}
      >
        {employees.map((emp) => (
          <EmployeeCard
            key={emp._id}
            id={emp._id}
            firstName={emp.firstName}
            lastName={emp.lastName}
            email={emp.email}
            title={emp.title}
            department={emp.department}
            location={emp.location}
            avatar={emp.avatar}
            onDelete={handleDeleteEmployee}
          />
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="btn-previous"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="btn-next"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default EmployeeList;
