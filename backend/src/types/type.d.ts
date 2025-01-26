import { ICompany, IFileExcel, IUser } from '../interfaces/interface';
import { TUserFromSchema } from '../schemas/userSchema';

export type TNewUser = Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>;
export type TNewUserEmployee = Omit<TNewUser, 'rolId'> & {
    rolId?: number
}

export type TNewCompany = Omit<ICompany, 'id' | 'createdAt' | 'updatedAt'>;

export type TNewFile = Omit<IFileExcel, 'id' | 'createdAt' | 'updatedAt' >; 

export type TFoundUser = Pick< IUser, 'id' ,'nit' | 'companyId' | 'rolId'>;

export type TFoundCompany = Pick< ICompany, 'id' | 'nameCompany' >;

type RenameKey< T, OldKey extends keyof T, NewKey extends string > = Omit < T, OldKey > & { [ K in NewKey ]: T[ OldKey ]};

export type TUserUpdatePassword = RenameKey< TNewUser, "password", 'confirmPassword'>