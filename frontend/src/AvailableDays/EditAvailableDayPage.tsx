import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const EditAvailableDayPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ personnelId: "", date: "", startTime: "", endTime: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: call your service later
    console.log(form);
    navigate("/available-days"); // return to main page
  };
  return(
  <div>
    
  </div>
  );
};
export default EditAvailableDayPage;