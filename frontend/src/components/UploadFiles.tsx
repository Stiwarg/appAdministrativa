"use client"
import { Download, Check, AlertCircle, X, Loader2 } from 'lucide-react';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { filesExcelsSchema,TypeFile, bimesters, month, TFilesExcelsSchema, TypePeriod } from '@proyecto/shared'
import { TUploadStatus } from '../types/types';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import {  AxiosError } from 'axios';
import { logError, logInfo } from '../utils/logger';

const UploadFilesForm: React.FC = () => {

  const navigate = useNavigate();
  const [ companies , setCompanies ] = useState< {id: number, nameCompany: string}[] >([]);
  const [ selectedCompany, setSelectedCompany ] = useState< string | null >( null );
  const [ selectedFile, setSelectedFile ] = useState< File | null >( null );
  const [ uploadedFile, setUploadedFile ] = useState< string | null >( null );
  const [ uploadedStatus, setUploadedStatus ] = useState< TUploadStatus >("idle");
  const [ errorMessage, setErrorMessage ] = useState< string >("");
  const fileInputRef = useRef< HTMLInputElement | null >(null); 
  const [ uploadResponse, setUploadResponse ] = useState<{
    message: string;
    filasProcesadas: number;
    filasOmitidas: number;
  } | null >( null );
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    reset,
    control, 
    formState: { errors } 
  } = useForm< TFilesExcelsSchema >({
    resolver: zodResolver( filesExcelsSchema )
  });

  const currentYear = new Date().getFullYear();
  const startYear = 2023;
  const availableYears = Array.from({ length: currentYear - startYear + 1 }, ( _, i ) => currentYear - i );
  
  const selectedTypeFile = watch("typeFile");
  const selectedPeriod = watch('period');
  const selectedYear = watch('year');

  logInfo("📅 Periodo seleccionado:", selectedPeriod);
    
  const periodOptions = useMemo(() => {
    return selectedTypeFile === TypeFile.RTE ? Object.values( month ) : Object.values( bimesters );
  }, [ selectedTypeFile ]); 
  
    // Resetear el período cuando cambia el tipo de archivo
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

  useEffect(() => {
    const fetchCompanies = async () => {

      try {
        const response = await api.get('/empresasAplicativo');
        logInfo("✅ Respuesta de empresas:", response); // <-- Verifica qué devuelve
        setCompanies( response.data || [] );

      } catch ( error: unknown ) {

        if ( error instanceof AxiosError ) {
          logError("❌ Error en mostrar las empresas:", error.response?.data || error.message);
          setErrorMessage( error.response?.data?.message || "Error al mostrar las empresas.")
        } else {
          logError("❌ Error desconocido:", error);
          setErrorMessage("Ocurrió un error inesperado. Inténtalo de nuevo.")
        }

      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    if ( periodOptions.length > 0 ) {
      setValue('period', periodOptions[0] as TypePeriod);
    }
  }, [ periodOptions, setValue ]);
  
    const handleFileChange = ( event: React.ChangeEvent< HTMLInputElement > ) => {
      const file = event.target.files?.[0];
      if ( file ) {
        setSelectedFile( file );
        setValue( "nameFile", `/uploads/excels/${Date.now()}_${file.name}` );
        setUploadedFile("idle");

      }
    }

    const dismissNotification = () => {
      setUploadedFile("");
      setUploadedStatus("idle");
      setErrorMessage("");
    }
  
    const onSubmit = async ( data: TFilesExcelsSchema ) => {
      logInfo("✅ Evento onSubmit ejecutado con datos:", data);
      //console.log("year", data.year);
      try {
        setUploadedStatus("uploading");
        const formData = new FormData();
        if ( selectedFile ) {
          formData.append("nameFile", selectedFile );
        }
        if ( data.empresaId ) {
          formData.append("empresaId", data.empresaId.toString());
        }
        formData.append("typeFile", data.typeFile);
        formData.append("period", data.period);
        formData.append("year", data.year.toString() );
        logInfo("📡 Enviando petición a /gestionExcels...");
        const response = await api.post('/gestionExcels', formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        logInfo('✅ Guardado de archivo de excel:', response.data);
        setUploadedStatus("success");
        setUploadedFile( selectedFile?.name || "Archivo subido" );
        
        // Actualizar estado con la respuesta del backend
        setUploadResponse( response.data );

        reset();
        setSelectedFile(null);
        setSelectedFile(null);

      } catch ( error: unknown ) {
        setUploadedStatus("error");
        if ( error instanceof AxiosError ) {
          logError("❌ Error al cargar el archivo de excel:", error.response?.data || error.message );
          setErrorMessage( error.response?.data?.message || "Error al guardar el archivo.");
        } else {
          logError("❌ Error desconocido:", error );
          setErrorMessage("Ocurrió un error inesperado. Inténtalo de nuevo.");
        }
      }
    }
    
    logInfo("🔍 Errores actuales:", errors);
    return (
          <div className="w-full max-w-4xl mx-auto border border-gray-200 p-4 rounded-md sm:p-6 md:p-8">
            <h2 className='text-2xl font-bold mb-6'>Cargar Archivos:</h2>
            <div className="space-y-6">

              {/* Notificación de éxito */}
              {
                uploadedStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-green-800 font-medium">Excel procesado y datos guardados correctamente</span>
                    </div>
                    <button onClick={dismissNotification} className="text-green-600 hover:text-green-800">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="pl-7 text-green-800">
                    <p>
                      Archivo: <span className="font-medium">{ uploadedFile }</span>
                    </p>
                    <p>
                      Filas procesadas: <span className="font-medium">{ uploadResponse?.filasProcesadas }</span>
                    </p>
                    <p>
                      Filas omitidas: <span className="font-medium">{ uploadResponse?.filasOmitidas }</span>
                    </p>
                  </div>
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

            <form onSubmit={ handleSubmit( onSubmit ) }>
              {/* Selector de empresas */}
              <div>
                <label className='block text-lg mb-2'>Seleccione la empresa a la que pertenece la información</label>
                <select 
                { ...register("empresaId") }
                className='w-full px-3 py-2 border border-gray-300 rounded-md bg-white' 
                defaultValue=""
                onChange={ ( e ) => { 
                  setSelectedCompany( e.target.value ) 
                }}
                >
                  <option value="" disabled>
                    Seleccione una empresa
                  </option>
                  { companies?.map(( company ) => (
                    <option key={ company.id } value={ company.id }>{ company.nameCompany }</option>
                  ))}
                </select>
                { errors.empresaId && ( <p className='text-red-500'>{ errors.empresaId.message }</p>)}
              </div>

              {/* Selector de tipo de archivo */}
              <div>
                <label className='block text-lg mb-2'>Tipo de archivo:</label>
                <select 
                { ...register("typeFile") }
                className='w-full px-3 py-2 border border-gray-300 rounded-md bg-white'
                defaultValue=""
                >
                  <option value="" disabled= { !!selectedTypeFile }>
                    Seleccione tipo de archivo
                  </option>
                  { Object.values( TypeFile ).map(( fileType ) => (
                    <option value={ fileType } key={ fileType }>{ fileType }</option>
                  ))}
                </select>
                { errors.typeFile && ( <p className='text-red-500'>{ errors.typeFile.message }</p>)}
              </div>

              {/* Selector de periodo */}
                <div>
                  <label className='block text-lg mb-2'>
                    Periodo
                  </label>
                  <Controller
                    name='period'
                    control= { control }
                    rules={{ required: 'El periodo es obligatorio' }}
                    render={({ field }) => (
                      <select {...field} className={`w-full px-3 py-2 border ${ !selectedTypeFile ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'border-gray-300 bg-white'} rounded-md `} disabled={ !selectedTypeFile } >
                        { periodOptions.length === 0 ? (
                          <option value="" disabled={ !!field.value }>
                            Seleccione un periodo
                          </option>
                        ) : (
                          periodOptions.map(( period ) => (
                            <option value={ period } key={ period }>{ period }</option>
                          ))

                        )}
                      </select>
                    )}
                  />
                  { errors.period && ( <p className='text-red-500'>{ errors.period.message }</p>)}
                </div>

                {/* Seleccione el año */}
                <div>
                  <label className='block text-lg mb-2'>Indique el año del archivo:</label>
                  <select 
                    { ...register("year") }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md bg-white'
                    defaultValue=""
                  >
                    <option value="" disabled= { !!selectedYear }>
                      Seleccione el año
                    </option>
                    {
                      availableYears.map(( year ) => (
                        <option value={ year } key={ year }>{ year } { year === currentYear ? "(Actual)" : ""}</option>
                      ))
                    }
                  </select>
                    { errors.year && ( <p className='text-red-500'>{ errors.year.message }</p>)}
                </div>
              

              { /* Área de cargar de archivos */ }
              
              <div>
                <label className='block text-lg mb-2'>Seleccione un archivo</label>
                  <div className="relative" onClick={ () => fileInputRef.current?.click() }>
                    <input 
                    { ...register( 'nameFile' )}
                    type="file" 
                    onChange={ handleFileChange }
                    className='hidden'
                    ref={ fileInputRef }
                    accept=".xlsx, .xls"
                    value={""}
                    />
                    <label 
                    htmlFor="file-upload"
                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed transition-colors cursor-pointer rounded-lg ${ !selectedFile ? 'border-gray-300  hover:border-gray-400' : ' bg-green-300  border-green-600 hover:border-green-700 ' }`}                   
                    >
                      <Download className={`w-12 h-12 mb-2 ${ !selectedFile ? 'text-gray-400' : 'text-green-500'}`}/>
                      <p className='text-center text-gray-600'>
                        Seleccione un archivo en formato Excel
                        <br />
                        ( .XLSX, .XLS ):
                      </p>
                      { selectedFile && (
                        <p className='mt-2 text-lg text-black font-bold'>Archivo seleccionado: { selectedFile.name }</p>
                      )}
                    </label>
                    { errors.nameFile && ( <p className='text-red-500'>{ errors.nameFile.message }</p>)}
                  </div>
              </div>

              {/* Botón de subir */}
              <div className="flex justify-center">
                <button 
                className={`w-full rounded-md font-bold mt-2 transition-colors py-3 flex items-center justify-center  ${ !selectedFile || !selectedCompany || !selectedTypeFile || !selectedYear ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-black text-white   hover:bg-gray-800 cursor-pointer" }`}
                disabled={!selectedFile || !selectedCompany || !selectedTypeFile || !selectedYear  }
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
              </div>
            </form>

            </div>
          </div>
    )
}

export default UploadFilesForm;