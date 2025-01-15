import { ICompany, IUser } from '../interfaces/interface';
import { TUserFromSchema } from '../schemas/userSchema';

export type TNewUser = Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>;
export type TNewUserEmployee = Omit<TNewUser, 'rolId'>

export type TNewCompany = Omit<ICompany, 'id' | 'createdAt' | 'updatedAt'>;

export type TFoundUser = Pick< IUser, 'nit' | 'companyId' | 'rolId'>;
