import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { ICompany } from '../interfaces/interface';

class Companies extends Model< ICompany > implements ICompany {
    public id!: number;
    public nameCompany!: string;
    public logo!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Companies.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    nameCompany: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'name_company',
        validate: {
            notEmpty: { msg: 'El nombre de la compañia no puede estar vacio' },
            len: { args: [ 1, 200], msg: 'El nombre de la compañia debe tener entre 1 y 200 caracteres' },
            is: {
                args: /^[a-zA-Z0-9\s._-]*$/,
                msg:'El nombre de la compañia contiene caracteres no permitidos'
            }
        }
    },
    logo: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'logo',
        validate: {
            isUrl: {
                msg: 'La URL del logo no es válida.'
            },
            is: {
                args: [/^.*\.(jpg|jpeg|png|gif)$/i],
                msg: 'El logo debe ser una imagen en formato JPG, JPEG o PNG.'
            }
        }
    },
    createdAt: {
        type: DataTypes.TIME,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    },
    updatedAt: {
        type: DataTypes.TIME,
        defaultValue: DataTypes.NOW,
        field: 'updated_at'
    }
}, {
    sequelize,
    modelName: 'Companies',
    tableName: 'companies',
    timestamps: true
});

export default Companies;