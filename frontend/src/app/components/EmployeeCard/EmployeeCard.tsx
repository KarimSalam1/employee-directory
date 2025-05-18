import React, { useState } from "react";
import "./EmployeeCard.css";
import {
  User,
  Mail,
  IdCard,
  Building,
  MapPin,
  Trash2,
  Pencil,
} from "lucide-react";
import Link from "next/link";

type EmployeeCardProps = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  department: string;
  location: string;
  avatar?: string;
  onDelete: (id: string) => void;
};

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  id,
  firstName,
  lastName,
  email,
  title,
  department,
  location,
  avatar,
  onDelete,
}) => {
  const [headline, setHeadline] = useState("Name");
  const [value, setValue] = useState(`${firstName} ${lastName}`);

  const infoMap = {
    name: {
      label: "Name",
      value: `${firstName} ${lastName}`,
    },
    email: {
      label: "Email",
      value: email,
    },
    title: {
      label: "Title",
      value: title,
    },
    department: {
      label: "Department",
      value: department,
    },
    location: {
      label: "Location",
      value: location,
    },
  };

  const handleHover = (key: keyof typeof infoMap) => {
    setHeadline(infoMap[key].label);
    setValue(infoMap[key].value);
  };

  const handleDeleteClick = () => {
    onDelete(id);
  };

  return (
    <div className="employee-card">
      <img
        src={avatar || "/user.png"}
        alt={`${firstName}'s avatar`}
        className="employee-avatar"
      />

      <div className="employee-details">
        <div className="employee-info">
          <p className="employee-headline">{headline}</p>
          <p className="employee-value">{value}</p>
        </div>

        <div className="employee-icons">
          <div className="icon" onMouseEnter={() => handleHover("name")}>
            <User color="#249851" />
          </div>
          <div className="icon" onMouseEnter={() => handleHover("email")}>
            <Mail color="#249851" />
          </div>
          <div className="icon" onMouseEnter={() => handleHover("title")}>
            <IdCard color="#249851" />
          </div>
          <div className="icon" onMouseEnter={() => handleHover("department")}>
            <Building color="#249851" />
          </div>
          <div className="icon" onMouseEnter={() => handleHover("location")}>
            <MapPin color="#249851" />
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <Link href={`/edit/${id}`}>
            <button className="edit-button" type="button" title="Edit Employee">
              <Pencil size={20} color="#249851" /> Edit
            </button>
          </Link>
          <button
            className="delete-button"
            onClick={handleDeleteClick}
            title="Delete Employee"
          >
            <Trash2 size={20} color="#dc2626" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
