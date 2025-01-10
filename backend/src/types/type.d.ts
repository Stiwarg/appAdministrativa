import { IUser } from '../interfaces/interface';

export type TNewUser = Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>;
