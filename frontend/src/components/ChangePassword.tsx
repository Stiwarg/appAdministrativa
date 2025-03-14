import { useEffect, useState } from 'react';
import { AlertCircle, Check, Eye, EyeOff, Loader2, X } from 'lucide-react';
import { updatePasswordUpdateWithoutNit } from '@proyecto/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormData, TUploadStatus } from '../types/types';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AxiosError } from 'axios';
import { logError, logInfo } from '../utils/logger';

const ChangePasswordForm: React.FC = () => {

  const navigate = useNavigate();
  const [ showPassword, setShowPassword ] = useState( false );
  const [ showconfirmPassword, setShowconfirmPassword ] = useState( false );
  const [ errorMessage, setErrorMessage ] = useState("");
  const [ uploadedStatus, setUploadedStatus ] = useState< TUploadStatus >("idle");
  const [isPasswordFilled, setIsPasswordFilled] = useState(false);
  const [isPasswordConfirmFilled, setIsPasswordConfirmFilled] = useState(false);

  const { 
        register, 
        handleSubmit,
        reset,
        formState: { errors },
      } = useForm< FormData >({
        resolver: zodResolver( updatePasswordUpdateWithoutNit ),
    });

    const dismissNotification = () => {
        setUploadedStatus("idle");
        setErrorMessage("");
    }

    useEffect(() => {
      api.get("/protected", { withCredentials: true })
        .then(() => {
          logInfo("✅ Usuario autenticado");
        })
        .catch(() => {
          logError('Usuario no autenticado, se queda en login');
          navigate('/login');
        });
    }, [ navigate ]);

    const onSubmit = async ( data: FormData ) => {
      logInfo("✅ Evento onSubmit ejecutado con datos:", data);

      try {
        setUploadedStatus('uploading');
        logInfo("📡 Enviando petición a /employee/password...");

        const response = await api.patch("/employee/password", data, {
          withCredentials: true 
        });

        logInfo("✅ Cambio de contraseña exitoso:", response.data);
        setUploadedStatus("success");
        reset(); // Reseteamos el formulario
        setTimeout( async () => {
          try {
            await api.post("/logout", {}, { withCredentials: true }); // EndPoint para cerrar sesión
            logInfo("✅ Sesión cerrada automáticamente después del cambio de contraseña.")
          } catch (error) {
            logError("❌ Error al cerrar sesión:", error);
          }
          navigate("/login")
        }, 2000)
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

          <div className="space-y-4 sm:space-y-6">
            {/* Notificación de éxito */}
            {uploadedStatus === "success" && (
              <div className="p-3 sm:p-4 bg-green-100 border border-green-300 rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2" />
                  <span className="text-green-800 text-sm sm:text-base">
                    La contraseña del usuario fue cambiada exitosamente. Se cerrará automáticamente la sesión.
                  </span>
                </div>
                <button onClick={dismissNotification} className="text-green-600 hover:text-green-800" type="button">
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
                  onClick={dismissNotification}
                  className="text-red-600 hover:text-red-800 ml-2 flex-shrink-0"
                  type="button"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            )}

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
                    !isPasswordFilled || !isPasswordConfirmFilled
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800 cursor-pointer"
                  }`}
                disabled={!isPasswordFilled || !isPasswordConfirmFilled || uploadedStatus === "uploading"}
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
export default ChangePasswordForm
