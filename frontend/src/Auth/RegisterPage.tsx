import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import type { RegisterDto } from "../types/Auth";
import { useAuth } from "./AuthContext";

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterDto>({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await register(form);
      setSuccess("User registered. You can now log in.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Registration failed");
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="registerUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="registerEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="registerPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button type="submit">Register</Button>
      </Form>
    </div>
  );
};

export default RegisterPage;
