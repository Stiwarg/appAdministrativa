import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Companies from '../models/companiesModel';
import { IFileExcel } from '../interfaces/interface';
import { TypeFile, TypePeriod } from '../utils/enums';

class FilesExcels extends Model< IFileExcel > implements IFileExcel {
    public id!: number;
    public typeFile!: TypeFile;
    public nameFile!: string;
    public empresaId!: number;
    public year!: number;
    public period!: TypePeriod;
    public createdAt!: Date;
    public updatedAt!: Date;
}

FilesExcels.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    typeFile: {
        type: DataTypes.ENUM,
        values: ['IVA','ICA','RTE'],
        allowNull: false,
        field: 'type_file',
        validate: {
            notNull: { msg: 'El tipo de archivo es obligatorio'},
            isIn: {
                args: [['IVA', 'ICA', 'RTE']],
                msg: 'El tipo de archivo debe ser uno de los siguientes: IVA, ICA, RTE'
            }
        }
    },
    nameFile: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'name_file',
        validate: {
            notEmpty: { msg: 'El nombre o la ruta del archivo es obligatorio' },
            len: { args: [ 1, 255], msg: 'El nombre de la compañia debe tener entre 1 y 200 caracteres' },
            is: {
                args: [/^(\/uploads\/excels\/[0-9]+_(IVA|ICA|RTE).*\.(xlsx|xls))$/i], 
                msg:'El nombre del archivo debe comenzar con ICA, IVA o RTE seguido de texto, números, guiones, rayas o espacios y terminar con .xlsx',
            }
        }
    },
    empresaId: {
        type: DataTypes.INTEGER,
        field:'empresa_id',
        references: {
            model: Companies,
            key: 'id'
        },
        allowNull: false
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'year'
    },
    period: { 
        type: DataTypes.ENUM(...Object.values( TypePeriod )),
        allowNull: false,
        field: 'period'
    },
    createdAt: {
        type: DataTypes.TIME,
        defaultValue: DataTypes.NOW,
        field: 'created_at', // Nombre real en la tabla
    },
    updatedAt: {
        type: DataTypes.TIME,
        defaultValue: DataTypes.NOW,
        field: 'updated_at'
    }
}, {
    sequelize,
    modelName: 'FilesExcels',
    tableName: 'filesExcels',
    timestamps: true
});

export default FilesExcels;