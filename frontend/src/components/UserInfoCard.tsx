import { IUserInfoCardProps } from '../interface/interface';

const UserInfoCard = ({ logoSrc, companyName, nit }: IUserInfoCardProps) => {
    return (
        <div className="max-w-md mx-auto border border-gray-200 p-4 sm:p-6 md:p-8 rounded-lg">
        {/* Logo de la empresa */}
        <img 
            src={ logoSrc } 
            alt={ `Logo de ${companyName}` } 
            className='w-full h-20 sm:h-28 flex items-center justify-center text-gray-600 text-xs sm:text-sm text-center p-2 sm:p-4 mb-4 sm:mb-6' 
        />
        <div className="text-center">
          <h2 className='text-xl sm:text-2xl font-bold mb-2'>Información Del Usuario</h2>
          <p className='text-gray-600 text-sm sm:text-base'>NIT: {nit}</p>
        </div>
      </div>
    )
}

export default UserInfoCard;