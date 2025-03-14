import { AlertCircle, Check, Download, Loader2, X } from 'lucide-react';
import { TCompanyFromSchema, companyCreateSchema } from '@proyecto/shared';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import React, { useState, useEffect, useRef } from "react";
import api from '../services/api';
import { useNavigate } from "react-router-dom";
import { TUploadStatus } from '../types/types';
import { logError, logInfo } from '../utils/logger';

const CompanyManagement = () => {

  const navigate = useNavigate();
  const [ errorMessage, setErrorMessage ] = useState("");
  const [ selectedFile, setSelectedFile ] = useState< File | null >( null );
  const fileInputRef = useRef< HTMLInputElement | null >(null); 
  const [ uploadedFile, setUploadedFile ] = useState< string | null >( null );
  const [ uploadedStatus, setUploadedStatus ] = useState< TUploadStatus >("idle");
  const [isNameFilled, setIsNameFilled] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm< TCompanyFromSchema >({
    resolver: zodResolver( companyCreateSchema ),
  });

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

  const handleFileChange = ( event: React.ChangeEvent< HTMLInputElement > ) => {
    const file = event.target.files?.[0];
    if ( file ) {
      setSelectedFile( file );
      setValue('logo', `/uploads/logos/${file.name}`);
      setUploadedFile("idle");
      logInfo("✅ Archivo seleccionado:", file);

    }
  }
  
  const dismissNotification = () => {
    setUploadedFile("");
    setUploadedStatus("idle");
    setErrorMessage("");
  }

  const onSubmit = async ( data: TCompanyFromSchema ) => {
    logInfo("✅ Evento onSubmit ejecutado con datos:", data);
    try {
      setUploadedStatus('uploading');
      const formData = new FormData();
      formData.append('nameCompany', data.nameCompany );

      if ( selectedFile ) {
        formData.append('logo', selectedFile );
      }
      logInfo("📡 Enviando petición a /gestionEmpresas...");


      const response = await api.post('/gestionEmpresas', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      logInfo('✅ Guardado de Gestión de Empresas:', response.data );

      // Actualizar estado de éxito
      setUploadedStatus("success");
      setUploadedFile(selectedFile?.name || "Archivo subido");

      reset();
      setSelectedFile(null);
    } catch (error: unknown ) {
      setUploadedStatus("error");
      if ( error instanceof AxiosError ) {
        logError("❌ Error en Gestión de Empresas:", error.response?.data || error.message);
        setErrorMessage(error.response?.data?.message || "Error al guardar la empresa");
      } else {
        logError("❌ Error desconocido:", error);
        setErrorMessage("Ocurrió un error inesperado. Inténtalo de nuevo.");
      }
    }
  }

    return (
        <div className="w-full max-w-4xl mx-auto border border-gray-200 p-4 rounded-md sm:p-6 md:p-8">
        <h2 className='text-2xl font-bold mb-6'>Gestión de Empresas:</h2>

       { errorMessage && <p className='text-red-500 text-center mb-4'>{ errorMessage }</p> }

        <div className="space-y-6">


        {/* Notificación de exito */}

        {
          uploadedStatus === 'success' && (
            <div className='mb-6 p-4 bg-green-100 border border-green-300 rounded-md flex items-center justify-between'>
              <div className="flex items-center">
                <Check className='w-5 h-5 text-green-600 mr-2'/>
                <span className='text-green-800'>
                  El archivo <strong>{ uploadedFile }</strong> se ha subido correctamente.
                </span>
              </div>
              <button onClick={ dismissNotification } className='text-green-600 hover:text-green-800' >
                <X className='w-5 h-5'/>
              </button>
            </div>
          )
        }

        {/* Notificación de error */}

        {
          uploadedStatus === 'error' && (
            <div className='mb-6 p-4 bg-red-100 border border-red-300 rounded-md flex items-center justify-between'>
              <div className='flex items-center'>
                <AlertCircle className='w-5 h-5 text-red-600 mr-6' />
                <span className='text-red-800'>
                  { errorMessage }
                </span>
              </div>
              <button onClick={ dismissNotification } className='text-red-600 hover:text-red-800'>
                <X className='w-5 h-5'/>
              </button>
            </div>
          )
        }
          {/* Nombre de la empresa */}
        <form onSubmit={ handleSubmit( onSubmit ) }>
          <div>
            <label className='block text-lg mb-2'>Nombre de la empresa:</label>
            <input
              { ...register("nameCompany") } 
              type="text"
              placeholder='Ingrese el nombre de la empresa'
              className='w-full px-3 py-2 border border-gray-300 rounded-md'
              onChange={(e) => setIsNameFilled(e.target.value.trim() !== "")}
            />
            {errors.nameCompany && <p className='mt-1 text-red-500 text-sm'>{ errors.nameCompany.message }</p>}
          </div>

          {/* Área de carga de imagen */}
          <div>
            <label className='block text-lg mb-2'>Cargue la imagen del logo de la empresa:</label>
            <div onClick={ () => fileInputRef.current?.click() } className={`border-2 border-dashed  rounded-lg p-8 text-center cursor-pointer  transition-colors ${ !selectedFile ? 'hover:border-gray-400 border-gray-300' : ' bg-green-300  border-green-600 hover:border-green-700' }`}>
              <input 
                { ...register('logo') }
                type="file" 
                ref={fileInputRef}
                onChange={ handleFileChange }
                className='hidden' 
                accept="image/jpeg, image/png, image/jpg, image/svg+xml"
                value={""}
                />
              <Download className={`w-14 h-14 mb-2 mx-auto ${ !selectedFile ? 'text-gray-400' : 'text-green-400'}`} />
              <p>
                Selecciona una imagen en formato 
                <br />
                ( .JPEG, .JPG, .PNG )
              </p>
              { selectedFile && ( 
                <p className='mt-2 text-lg text-black font-bold'>Archivo seleccionado: { selectedFile.name }
                </p>
               )}
              { errors.logo && <p className='mt-1 text-red-500 text-sm'>{ errors.logo.message }</p> }
            </div>
          </div>

          {/* Botón de agregar */}
          <button
            className={`w-full py-3 rounded-md transition-colors font-bold mt-2
              ${!selectedFile || !isNameFilled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800 cursor-pointer'}`}
            disabled={!selectedFile || !isNameFilled }
          >
            {
              uploadedStatus === 'uploading' ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Subiendo...
                </>
              ) : (
                "Subir archivo"
              )
            }
          </button>
        </form>
          
        </div>
      </div>
    );
};

export default CompanyManagement;