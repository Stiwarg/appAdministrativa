"use client";
import logo from "./img/logoCompanyCesar.jpg";
import { useState, useEffect } from "react";
import { loginSchema, TLoginSchema } from "@proyecto/shared";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from 'lucide-react';
import { logError, logInfo } from "./utils/logger";
import { checkSession, login } from './services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [ showPassword, setShowPassword ] = useState( false );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const verifySession = async () => {
      const isAuthenticated = await checkSession();
      if ( isAuthenticated ) {
        navigate("/dashboard");
      }
    }
    verifySession();
  }, [ navigate ]);

  const onSubmit = async (data: TLoginSchema) => {
    logInfo("✅ Evento onSubmit ejecutado con datos:", data);
    const result = await login(data); // Llamamos la función modularizada
  
    console.log("🔍 Resultado del login:", result); // Debugging
  
    if (!result.success) {
      logError("❌ Error en login:", result.message);
      setErrorMessage(result.message || "Ocurrió un error inesperado. Inténtalo de nuevo.");
      return;
    }
  
    navigate("/dashboard");
  };    

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="bg-white p-4 sm:p-8 w-full max-w-md rounded-lg shadow-md">
        <div className="flex justify-center mb-4 sm:mb-8">
          <img
            src={logo || "/placeholder.svg"}
            alt="logo"
            className="w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] h-auto object-contain"
          />
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-center mb-4 sm:mb-8">Bienvenido</h1>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm sm:text-base">
            {errorMessage}
          </div>
        )}

        <form
          onSubmit={
            handleSubmit(onSubmit)
          }
        >
          <div className="mb-4">
            <label htmlFor="nit" className="block text-base sm:text-lg font-medium mb-2">
              NIT
            </label>
            <input
              id="nit"
              type="number"
              {...register("nit", { valueAsNumber: true })}
              placeholder="Ingrese el NIT de la empresa"
              className={`w-full px-3 py-2 border ${errors.nit ? "border-red-500" : "border-gray-300"} rounded-md`}
              required
            />
            {errors.nit && <p className="mt-1 text-red-500 text-sm">{errors.nit.message}</p>}
          </div>
          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-base sm:text-lg font-medium mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Ingrese su contraseña"
                className={`w-full px-3 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md`}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 sm:py-3 rounded-md hover:bg-gray-800 transition-colors text-sm sm:text-base font-medium"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  )
}
