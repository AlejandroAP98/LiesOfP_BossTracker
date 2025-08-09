import { useState } from "react";
import logo from "../assets/logo.webp";

interface LoginProps {
  onLogin: (username: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [isValid, setIsValid] = useState(true);

  const usernamePattern = /^[A-Za-z][A-Za-z0-9-]*$/;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernamePattern.test(username)) {
      onLogin(username.trim());
    } else {
      setIsValid(false);
    }
  };

  const handleChange = (value: string) => {
    setUsername(value);
    setIsValid(usernamePattern.test(value) || value === "");
  };

  return (
    <div className="container flex justify-center items-center h-screen bg-base-100 w-full">
      <div className="card flex justify-center items-center bg-base-200 p-8">
        <figure className="p-4 flex justify-center">
          <img
            src={logo}
            alt="Logo Lies of P Boss Tracker"
            className="w-48 h-48 rounded-full object-cover"
          />
        </figure>
        <h1 className="card-title text-2xl font-bold text-center mb-6">
          Lies of P Boss Tracker
        </h1>
        <h2 className="text-center">Ingresa tu username para empezar</h2>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
            <input
              type="text"
              className={`input ${!isValid ? "input-error" : ""}`}
              required
              placeholder="Username"
              value={username}
              onChange={(e: any) => handleChange(e.target.value)}
            />

            {!isValid && (
              <p className="text-error text-sm">
                El username solo puede contener letras, números y guiones, y debe empezar con una letra.
              </p>
            )}

            <div className="card-actions flex justify-center">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!usernamePattern.test(username)}
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
