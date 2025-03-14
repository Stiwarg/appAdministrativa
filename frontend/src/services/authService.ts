import { TLoginSchema } from '@proyecto/shared';
import api from '../services/api';
import { logError, logInfo } from '../utils/logger';
import { AxiosError } from 'axios';

export const checkSession = async(): Promise< boolean > => {
    try {
        const response = await api.get('/auth/validate', { withCredentials: true });
        logInfo("✅ Usuario autenticado:", response.data );
        return true;
    } catch (error) {
        logError("❌ Usuario no autenticado, permanece en el login.", error);
        return false;
    }
}

export const login = async (data: TLoginSchema): Promise<{ success: boolean; message?: string }> => {
    logInfo("📡 Enviando petición a /login...");
    try {
      const response = await api.post("/login", data, { withCredentials: true });
      logInfo("✅ Login exitoso:", response.data);
      return { success: true, message: "" };
    } catch (error: unknown) {
      logError("❌ Error en login:", error);
  
      if (error instanceof AxiosError) {
        let errorMsg = error.response?.data?.message;
  
        // 🛠️ Si el mensaje no es un string, lo convertimos
        if (!errorMsg || typeof errorMsg !== "string") {
          errorMsg = "Credenciales incorrectas. Intenta nuevamente.";
        }
  
        return { success: false, message: errorMsg };
      }
  
      return { success: false, message: "Ocurrió un error inesperado. Inténtalo de nuevo." };
    }
  };