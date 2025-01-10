import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import FilesExcels from '../models/filesExcelsModel';
import { IFileDetails } from '../interfaces/interface';

class FilesDetails extends Model< IFileDetails > implements IFileDetails {
    public id!: number;
    public filesExcelsId!: number;
    public tpRete!: string;
    public nitRegister!: number;
    public dv!: number;
    public nameCompany!: string;
    public nameConcept!: string;
    public base!: number;
    public valueRetained!: number;
    public percentage!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

FilesDetails.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        field: 'id'
    },
    filesExcelsId: {
        type: DataTypes.INTEGER,
        field: 'filesExcels_id',
        references: {
            model: FilesExcels,
            key: 'id'
        },
        allowNull: false
    },
    tpRete: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'tp_rete'
    },
    nitRegister: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'nit_register'
    },
    dv: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'dv'
    },
    nameCompany: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'name_company'
    },
    nameConcept: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'name_concept'
    },
    base: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'base'
    },
    valueRetained: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'value_retained'
    },
    percentage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'percentage'
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
    modelName: 'FileDetails',
    tableName: 'fileDetails',
    timestamps: true
});

export default FilesDetails;