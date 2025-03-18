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
                args: /^[a-zA-Z0-9Ññ]([a-zA-Z0-9Ññ\s.,'()-]*(?:[ &]+[a-zA-Z0-9Ññ\s.,'()-]+)*)?$/,
                msg:'El nombre de la compañia contiene caracteres no permitidos'
            }
        }
    },
    logo: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'logo',
        validate: {
            notEmpty: {
                msg: 'El logo no puede estar vacio'
            },
            is: {
                args: [/^(\/uploads\/logos\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png))$/i],
                msg: 'El logo debe ser una ruta válida en formato JPG, JPEG, PNG o JFIF.',
            },
        }
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
}, {
    sequelize,
    modelName: 'Companies',
    tableName: 'companies',
    timestamps: true
});

export default Companies;