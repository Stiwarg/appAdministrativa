import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Companies from '../models/companiesModel';
import Roles from '../models/rolesModel';
import { IUser } from '../interfaces/interface';
//import bcrypt from 'bcrypt';
//import { TNewUser } from '../types/type';

class Users extends Model<IUser> implements IUser {
    public readonly id!: number;
    public nit!: number;
    public password!: string;
    public companyId!: number;
    public rolId!: number;
    public readonly createdAt!: Date;
    public updatedAt!: Date;

}

Users.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        field: 'id'
    },
    nit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'nit',
        unique: true,
        validate: {
            isInt: true,
            notNull: { msg: 'El NIT es obligatorio' },
            min: { args: [100000], msg: 'El NIT debe ser mayor o igual a 100000'}
        }                
    },                      
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'password',
        validate: {
            len: {
                args: [ 8, 255],
                msg: 'La contraseña debe tener entre 8 y 100 carecteres.'
            }
        }
    },
    companyId: {
        type: DataTypes.INTEGER,
        field: 'company_id',
        references: {
            model: Companies,
            key: 'id',
        },
        allowNull: false,
    },
    rolId: {
        type: DataTypes.INTEGER,
        field: 'rol_id',
        references: {
            model: Roles,
            key: 'id'
        },
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'updated_at'
    }
}, 
    { 
        sequelize,
        modelName: 'Users',
        tableName: 'users',
        timestamps: true // Controla 'CreatedAt' 
},);

// Hook: Hash automático de contraseñas antes de guardar 
/*Users.beforeCreate( async ( user ) => {
    if ( user.password ) {
        user.password = await bcrypt.hash( user.password, 10 );
    }
});*/

Users.prototype.toJSON = function () {
    const values: Partial<IUser> = { ...this.get() };
    delete values.password;
    return values;
};

export default Users;