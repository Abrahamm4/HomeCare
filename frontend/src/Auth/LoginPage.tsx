import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { LoginDto } from "../types/Auth";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;

  const [form, setForm] = useState<LoginDto>({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Login failed");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="loginUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="loginPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button type="submit">Log in</Button>
      </Form>
    </div>
  );
};

export default LoginPage;
