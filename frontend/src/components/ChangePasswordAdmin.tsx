"use client"
import {  Search, Eye, EyeOff, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { updatePasswordSchema,  } from '@proyecto/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormDataNit, TUploadStatus } from '../types/types';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { IFindByNit } from '../interface/interface';
import { logError, logInfo, logWarn } from '../utils/logger';

const ChangePasswordAdminForm: React.FC = () => {
    const navigate = useNavigate();
    const [ showPassword, setShowPassword ] = useState( false );
    const [ showconfirmPassword, setShowconfirmPassword ] = useState( false );
    const [ errorMessage, setErrorMessage ] = useState("");
    const [ uploadedStatus, setUploadedStatus ] = useState< TUploadStatus >("idle");
    const [isNiTFilled, setIsNiTFilled] = useState(false);
    const [isPasswordFilled, setIsPasswordFilled] = useState(false);
    const [isPasswordConfirmFilled, setIsPasswordConfirmFilled] = useState(false);
    const [isNitFound, setIsNitFound] = useState(false);
    const [updatedNit, setUpdatedNit] = useState<number | null>(null);
    const [ adminNit, setAdminNit ] = useState< number | null >( null );
  
    const { 
      register, 
      handleSubmit,
      reset,
      watch, 
      formState: { errors },
    } = useForm< FormDataNit >({
      resolver: zodResolver( updatePasswordSchema ),
    });


    const dismissNotification = () => {
      setUploadedStatus("idle");
      setErrorMessage("");
    }

    useEffect(() => {
      api.get("/protected", { withCredentials: true })
        .then(( response ) => {
          logInfo("✅ Usuario autenticado", response );
          console.log("✅ Usuario autenticado", response.data.user.nit );
          const nitFromCookies = response.data.user.nit;
          setAdminNit( nitFromCookies ); 
        })
        .catch(() => {
          logError('Usuario no autenticado, se queda en login');
          navigate('/login');
        });
    }, [ navigate ]);

    const verifyNit = async ( dataNit: IFindByNit ) => {
      logInfo("✅ Evento onSubmit ejecutado con datos:", dataNit );
  
        // 1️⃣ Validar si el NIT está vacío o no es un número válido
      if (!dataNit.nit || isNaN(dataNit.nit) || dataNit.nit <= 0) {
        logWarn("⚠️ NIT inválido. No se realizará la búsqueda.");
        setErrorMessage("Por favor, ingrese un NIT válido.");
        return;
      }

      // 2️⃣ Evitar buscar si el mismo NIT ya fue encontrado
      if (isNitFound) {
        logWarn("⚠️ NIT ya encontrado. No se requiere nueva búsqueda.");
        return;
      }

      try {
        const response = await api.post("/admin/usersfind", dataNit, {
          withCredentials: true 
        });
        setIsNitFound(true);
        logInfo("✅ Nit encontrado exitosamente:", response.data);
      } catch ( error: unknown ) {

        if ( error instanceof AxiosError ) {
          logError("❌ Error en buscar al Nit:", error.response?.data || error.message);
          setErrorMessage(error.response?.data?.message || "Error al cambiar la contraseña.");
        } else {
          logError("❌ Error desconocido:", error);
          setErrorMessage("Ocurrió un error inesperado. Inténtalo de nuevo.");
        }

      }

    }

    console.log('este es el nit del admin:', adminNit);
    const onSubmit = async ( data: FormDataNit ) => {
      logInfo("✅ Evento onSubmit ejecutado con datos:", data);

      try {
        setUploadedStatus('uploading');
        logInfo("📡 Enviando petición a /admin/password...");

        const response = await api.patch("/admin/password", data, {
          withCredentials: true 
        });

        logInfo("✅ Cambio de contraseña exitoso:", response.data);
        setUploadedStatus("success");
        setUpdatedNit( data.nit );
        reset(); // Reseteamos el formulario
        setIsNitFound( false );

        if ( adminNit && data.nit === adminNit ) {
          setTimeout( async () => {
            try {
              await api.post("/logout", {}, { withCredentials: true });
              logInfo("✅ Sesión cerrada automáticamente después del cambio de contraseña.")
            } catch (error) {
              logError("❌ Error al cerrar sesión:", error );
            } finally {
              navigate("/login"); // Se ejecuta siempre, haya error o no.
            }
          }, 2000)
        }

      } catch ( error: unknown ) {
        setUploadedStatus("error");
        if ( error instanceof AxiosError ) {
          logError("❌ Error en cambiar la contraseña:", error.response?.data || error.message);
          setErrorMessage( error.response?.data?.message || "Error al cambiar la contraseña.")
        } else {
          logError("❌ Error desconocido:", error);
          setErrorMessage("Ocurrió un error inesperado. Inténtalo de nuevo.")
        }
      }
    }

    return (
      
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-0">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full border border-gray-200 p-3 sm:p-4 md:p-6 lg:p-8 rounded-md shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Cambiar Contraseña:</h2>
  
            {errorMessage && (
              <div className="mb-4 p-3 sm:p-4 bg-red-100 border border-red-300 rounded-md text-red-800 text-sm sm:text-base">
                {errorMessage}
              </div>
            )}
  
            <div className="space-y-4 sm:space-y-6">
              {/* Notificación de éxito */}
              {uploadedStatus === "success" && (
                <div className="p-3 sm:p-4 bg-green-100 border border-green-300 rounded-md flex items-center justify-between">
                  <div className="flex items-center">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 flex-shrink-0" />
                    <span className="text-green-800 text-sm sm:text-base">
                      {
                        updatedNit === adminNit 
                        ? `La contraseña del administrador con NIT ${updatedNit} fue cambiada con éxito. La sesión se cerrará automaticamente, inicie sesión nuevamente.`
                        : `La contraseña del usuario con el NIT ${ updatedNit } fue cambiada exitosamente.`
                      }
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={dismissNotification}
                    className="text-green-600 hover:text-green-800 ml-2 flex-shrink-0"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              )}
  
              {/* Notificación de error */}
              {uploadedStatus === "error" && (
                <div className="p-3 sm:p-4 bg-red-100 border border-red-300 rounded-md flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mr-2 flex-shrink-0" />
                    <span className="text-red-800 text-sm sm:text-base">{errorMessage}</span>
                  </div>
                  <button
                    type="button"
                    onClick={dismissNotification}
                    className="text-red-600 hover:text-red-800 ml-2 flex-shrink-0"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              )}
  
              {/* NIT */}
              <div className="space-y-2 sm:space-y-0 sm:flex sm:items-end sm:gap-3">
                <div className="flex-1">
                  <label className="block text-base sm:text-lg font-medium mb-1 sm:mb-2">NIT:</label>
                  <div className="relative">
                    <input
                      {...register("nit", { valueAsNumber: true })}
                      type="number"
                      required
                      placeholder="Ingrese el NIT"
                      className={`w-full px-3 py-2 border ${errors.nit ? "border-red-500" : isNitFound ? "border-green-500 bg-green-50" : "border-gray-300"} rounded-md`}
                      onChange={(e) => {
                        setIsNiTFilled(e.target.value.length !== 0)
                        setIsNitFound(false)
                      }}
                    />
                    {isNitFound && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Check className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    )}
                  </div>
                  {errors.nit && <p className="text-red-500 text-xs sm:text-sm font-medium mt-1">{errors.nit.message}</p>}
                </div>
  
                <button
                  type="button"
                  className={`w-full sm:w-auto px-4 py-2 rounded-md transition-colors font-medium text-sm sm:text-base flex items-center justify-center gap-1 ${isNiTFilled ? "bg-black text-white hover:bg-gray-800 cursor-pointer" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                  onClick={() => verifyNit({ nit: Number(watch("nit")) })}
                  disabled={!isNiTFilled}
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Buscar NIT</span>
                </button>
              </div>
  
              {/* Nueva Contraseña */}
              <div>
                <label className="block text-base sm:text-lg font-medium mb-1 sm:mb-2">Nueva contraseña:</label>
                <div className="space-y-1">
                  <div className="relative">
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingrese la nueva contraseña"
                      className={`w-full px-3 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md`}
                      onChange={(e) => setIsPasswordFilled(e.target.value.trim() !== "")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-blue-500"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs sm:text-sm font-medium">{errors.password.message}</p>
                  )}
                </div>
              </div>
  
              {/* Confirmar nueva Contraseña */}
              <div>
                <label className="block text-base sm:text-lg font-medium mb-1 sm:mb-2">Confirmar nueva contraseña:</label>
                <div className="space-y-1">
                  <div className="relative">
                    <input
                      {...register("newPassword")}
                      type={showconfirmPassword ? "text" : "password"}
                      placeholder="Confirmar la nueva contraseña"
                      className={`w-full px-3 py-2 border ${errors.newPassword ? "border-red-500" : "border-gray-300"} rounded-md`}
                      onChange={(e) => setIsPasswordConfirmFilled(e.target.value.trim() !== "")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowconfirmPassword(!showconfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-blue-500"
                    >
                      {showconfirmPassword ? (
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-500 text-xs sm:text-sm font-medium">{errors.newPassword.message}</p>
                  )}
                </div>
              </div>
  
              {/* Botón de actualizar */}
              <div className="pt-2 sm:pt-4">
                <button
                  className={`w-full py-2 sm:py-3 rounded-md transition-colors font-bold text-sm sm:text-base
                        ${
                          !isNiTFilled || !isPasswordFilled || !isPasswordConfirmFilled || !isNitFound
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-black text-white hover:bg-gray-800 cursor-pointer"
                        }`}
                  disabled={
                    !isNiTFilled ||
                    !isPasswordFilled ||
                    !isPasswordConfirmFilled ||
                    !isNitFound ||
                    uploadedStatus === "uploading"
                  }
                >
                  {uploadedStatus === "uploading" ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                      <span>Actualizando...</span>
                    </div>
                  ) : (
                    "Actualizar Contraseña"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
}

export default ChangePasswordAdminForm;