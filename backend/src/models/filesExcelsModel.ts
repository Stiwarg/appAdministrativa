import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Companies from '../models/companiesModel';
import { IFileExcel } from '../interfaces/interface';
import { TypeFile } from '../utils/enums';

class FilesExcels extends Model< IFileExcel > implements IFileExcel {
    public id!: number;
    public typeFile!: TypeFile;
    public nameFile!: string;
    public empresaId!: number;
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
        field: 'type_file'
    },
    nameFile: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'name_file'
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