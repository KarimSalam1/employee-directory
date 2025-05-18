"use client";

import { useState } from "react";
import EmployeeList from "./components/EmployeesList/EmployeesList";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";

const Home = () => {
  const [loading, setLoading] = useState(true);

  return (
    <main>
      {loading && <LoadingSpinner />}
      <EmployeeList setLoading={setLoading} />
    </main>
  );
};

export default Home;
