"use client"
import { Download, Check, AlertCircle, X, Loader2, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { certificateSchema, Certificate , bimesters, month, certificateRequest } from '@proyecto/shared'
import { TSearchStatus } from '../types/types';
import { AxiosError } from 'axios';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { IYearOptions } from '../interface/interface';
import { logError, logInfo } from '../utils/logger';

const DownloadCertificatesForm: React.FC = () => {

    const navigate = useNavigate();
    const [ years, setYears ] = useState< IYearOptions | null >( null );
    const [isNiTFilled, setIsNiTFilled] = useState(false);

    const [ errorMessage, setErrorMessage ] = useState< string >("");
    const [ selectedYear, setSelectedYear ] = useState< number | null >( null );
    const [ searchStatus, setSearchStatus ] = useState< TSearchStatus >("idle");
    const [ certificateFound, setCertificateFound ] = useState< boolean >(false);
    const [ message, setMessage ] = useState< string | null >( null );
  
    const { 
      register, 
      handleSubmit, 
      watch, 
      control, 
      setValue,
      formState: { errors } 
    } = useForm< certificateRequest >({
      resolver: zodResolver( certificateSchema )
    });
  
    const selectedTypeCertificate = watch("typeFile");
    const selectedPeriod = watch('period');
    const selectedNit = watch('nit');

    const resetCertificate = () =>{
      if ( certificateFound ) {
        setCertificateFound( false );
        setSearchStatus("idle");
        setErrorMessage("");
      }
    }

  
    // Resetear el período cuando cambia el tipo de archivo
    useEffect(() => {
      const fetchYears = async () => {
        try {
          const response = await api.get('/certificadosOpciones');
          logInfo("✅ Respuesta de años:", response );
          setYears( response.data || [] );

        } catch ( error: unknown ) {
          if ( error instanceof AxiosError ) {
            logError("❌ Error al mostrar los años", error.response?.data || error.message );
          } else {
            logError("❌ Error desconocido:", error);
            setErrorMessage("Ocurrió un error inesperado. Inténtalo de nuevo.");
          }
        }
      };
      fetchYears();
    }, []);
  
    useEffect(() => {
      api.get("/protected", { withCredentials: true })
        .then(() => {
          logInfo("✅ Usuario autenticado");
        })
        .catch(() => {
          console.error('Usuario no autenticado, se queda en login');
          navigate('/login');
        });
    }, [ navigate ]);
  
    const dismissNotification = () => {
      setErrorMessage("");
      setSearchStatus('idle');      
    }
    
    const periodOptions = selectedTypeCertificate === Certificate.CERTIFICADO_RETENCION_FUENTE_RTE ? Object.values( month ) : Object.values( bimesters );

    const handleCertificateTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setValue('typeFile', event.target.value as Certificate )
      resetCertificate();
    }

    const handleNitChange = ( e: React.ChangeEvent< HTMLInputElement > ) => {
      setIsNiTFilled( !!e.target.value );
      resetCertificate();
    }

    const handleYearChange = ( e: React.ChangeEvent< HTMLSelectElement > ) => {
      setSelectedYear( Number( e.target.value ) );
      resetCertificate();
    }

    const handlePeriodChange = () => {
      resetCertificate();
    }


    const handleSearch = async ( data: certificateRequest ) => {
      setSearchStatus("searching");
      logInfo('Esta es la busqueda:', data );
      try {
        const response = await api.post('/buscarDetallesUsuario', data, {
          withCredentials: true
        });

        if ( !response.data.certificateFound ) {
          setSearchStatus("error");
          setCertificateFound( false );
          setErrorMessage( response.data.message || "No se encontró un certificado para los datos ingresados.");
          return;
        }

        setCertificateFound( response.data.certificateFound );
        setMessage( response.data.message );
        setSearchStatus("success");
      } catch (error: unknown ) {
        setSearchStatus('error');
        setCertificateFound( false );
        if ( error instanceof AxiosError ) {
          logError('❌ Error buscando detalles del usuario:', error.response?.data || error.message );
          setErrorMessage( error.response?.data?.message ||'Ocurrió un error al buscar detalles del usuario.')
        } else {
          logError("❌ Error desconocido:", error );
          setErrorMessage("Ocurrió un error inesperado. Inténtalo de nuevo.");
        }
      }
    }
  
    const handleDownloadCertificate = async ( data: certificateRequest ) => {
      setSearchStatus("searching");
      setErrorMessage("");
  
      console.log('Este es data:', data);
      try {
        const response = await api.post('/certificado', data, {
          withCredentials: true,
          responseType: "blob"
        });
        console.log('Este es el response:', response);
        const blob = new Blob([response.data], { type: "application/pdf"});
        const link = document.createElement("a");
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = `certificado.pdf`;
        document.body.appendChild( link );
        link.click();
        document.body.removeChild( link );
        window.URL.revokeObjectURL( url );

        setCertificateFound( true );
        setSearchStatus('success');
      } catch (error: unknown ) {
        setSearchStatus('error');
        setCertificateFound( false );
        if ( error instanceof AxiosError ) {
          logError('❌ Error buscando certificado:', error.response?.data || error.message );
          setErrorMessage( error.response?.data?.message ||'Ocurrió un error al buscar el certificado.')
        } else {
          logError("❌ Error desconocido:", error );
          setErrorMessage("Ocurrió un error inesperado. Inténtalo de nuevo.");
        }

      }
    }

  
    return (
        <form onSubmit={ handleSubmit( handleSearch ) }>
            <div className="w-full max-w-4xl mx-auto border border-gray-200 p-4 rounded-md sm:p-6 md:p-8">
              <h2 className='text-2xl font-bold mb-6'>Descargar Certificados: </h2>

                {
                  searchStatus === "success" && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-md flex items-center justify-between">
                      <div className="flex items-center">
                        <Check className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-green-800">Certificado encontrado correctamente.</span>
                      </div>
                      <button onClick={dismissNotification} className="text-green-600 hover:text-green-800">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                )}

                  { searchStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-md flex items-center justify-between">
                      <div className="flex items-center">
                        <AlertCircle className='w-5 h-5 text-red-600 mr-2 '/>
                        <span className='text-red-800'>{ errorMessage }</span>
                      </div>
                      <button onClick={ dismissNotification } className='text-red-600 hover:text-red-800'>
                        <X className='w-5 h-5' />
                      </button>
                    </div>
                  )}



                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className='space-y-6'>
                      {/* IVA, RFE, ICA */}
                      <div>
                        <label className='block text-lg mb-2'>IVA/RTE/ICA:</label>
                        <select 
                        { ...register('typeFile') } 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                        onChange={ handleCertificateTypeChange }
                        >
                          <option value="" disabled={ !!selectedTypeCertificate } >
                             Seleccione el certificado que desea descargar
                          </option>
                          { Object.values( Certificate ).map(( certificateType ) => (
                            <option value={ certificateType } key={ certificateType }>{ certificateType }</option>
                          ))}
                        </select>
                        { errors.typeFile && (
                          <p className='text-red-500'>{ errors.typeFile.message }</p>
                        )}
                      </div>

                      {/* NIT */}
                      <div>
                        <label className="block text-lg mb-2">NIT:</label>
                        <input 
                        { ...register('nit', { valueAsNumber: true }) } 
                          type="number" 
                          placeholder='Ingrese el NIT'
                          className='w-full px-3 py-2 border border-gray-300 rounded-md'
                          required
                          onChange={ ( e ) => {
                            setIsNiTFilled( e.target.value.length !== 0 );
                            handleNitChange( e )
                          }}
                        />
                        { errors.nit  && ( <p className='text-red-500'>{ errors.nit.message }</p>)}
                      </div>

                      {/* Año */}
                      <div>
                        <label className="block text-lg mb-2">Año:</label>
                        <select
                        { ...register('year', { valueAsNumber: true }) } 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                        defaultValue=""
                        onChange={ ( e ) => {
                          setSelectedYear( Number(e.target.value) );
                          handleYearChange( e );
                        }}
                        >
                          <option value="" disabled>Seleccione un año</option>
                          { years && years.years.length > 0  ? (
                            years!.years.slice(1).map(( year ) => (
                              <option key={ year } value={ year }>{ year }</option>
                            ))
                          ) : (
                            <option disabled>No hay años disponibles</option>
                          )
                        }
                        </select>
                        { errors.year && ( <p className='text-red-500'>{ errors.year.message }</p>)}
                      </div>

                      {/* Periodo */}
                      <div>
                        <label className="block text-lg mb-2">Periodo:</label>
                        <Controller 
                          name='period'
                          control={ control }
                          render={({ field }) => (
                            <select 
                            { ...field } 
                            className={`w-full px-3 py-2 border ${ !selectedTypeCertificate ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'border-gray-300 bg-white'} rounded-md `} 
                            disabled={ !selectedTypeCertificate } 
                            onChange={( e ) => {
                              field.onChange( e );
                              handlePeriodChange();
                            }}  
                            >
                            <option value="" disabled={ !!field.value }>
                              Seleccione un periodo
                            </option>
                            { periodOptions.map(( period ) => (
                              <option value={ period } key={ period }>{ period }</option>
                            ))}
                        </select>
                          )}
                        />
                        {
                          errors.period && ( <p className='text-red-500'>{ errors.period.message }</p>)
                        }
                        
                      </div>

                      {/* Botón de búsqueda */}
                      <div>
                        <button
                          className={`w-full rounded-md py-3 transition-colors font-bold flex items-center justify-center ${ !selectedTypeCertificate || periodOptions.length === 0 || !selectedYear || !isNiTFilled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800  cursor-pointer'} `}
                          disabled= { !selectedTypeCertificate || periodOptions.length === 0 || !selectedYear || !isNiTFilled }
                        >
                          { searchStatus === "searching" ? (
                              <>
                                <Loader2 className='w-5 h-5 mr-2 animate-spin'/>
                                Buscando...
                              </>
                            ) : (
                              <>
                                <Search className='w-5 h-5 mr-2' />
                                Buscar Certificado
                              </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Panel de generación de certificado */}
                    <div>
                      <h3 className='text-xl font-semibold mb-4 text-center'>Generación de Certificado</h3>

                      { certificateFound ? (
                        <div className="p-6 bg-green-50 border border-green-200 rounded-lg">

                          <div className="mb-4 space-y-2">
                            
                            <div className="flex items-center">
                              <Check className='w-5 h-5 text-green-600 mr-2' />
                              <span className='text-green-800 font-medium'>Certificado encontrado</span>
                            </div>

                            <div className="text-sm text-gray-700">
                              <p>
                                <strong>Tipo:{ selectedTypeCertificate }</strong>
                              </p>
                              <p>
                                <strong>NIT:{ selectedNit }</strong>
                              </p>
                              <p>
                                <strong>Año:{ selectedYear }</strong>
                              </p>
                              <p>
                                <strong>Periodo:{ selectedPeriod }</strong>
                              </p>
                            </div>

                          </div>
                          
                          <button 
                          className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors font-bold cursor-pointer flex items-center justify-center"
                          onClick={() => handleDownloadCertificate({ nit: selectedNit, period: selectedPeriod, typeFile: selectedTypeCertificate, year: selectedYear! })}
                          >
                            <Download className='w-5 h-5 mr-2'/>
                            Descargar Certificado
                          </button>
                        </div>
                      ) : (
                        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center text-gray-600">
                          { message || "No se ha generado ningún certificado aún." }
                        </div>
                      )}
                    </div>
                </div>
            </div>
        </form>
    );
};

export default DownloadCertificatesForm;