import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Companies from '../models/companiesModel';
import Users from '../models/UsersModel';
import { ICertificate } from '../interfaces/interface';
import { TypeFile } from '../utils/enums';

class Certificates extends Model< ICertificate >  implements ICertificate {
    public id!: number;
    public userId!: number;
    public companyId!: number;
    public typeFile!: TypeFile;
    public archivoPdf!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Certificates.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        field: 'id'
    },
    userId: {
        type: DataTypes.INTEGER,
        field: 'user_id',
        references: {
            model: Users,
            key: 'id'
        },
        allowNull: false
    },
    companyId: {
        type: DataTypes.INTEGER,
        field:'company_id', 
        references: {
            model: Companies,
            key: 'id'
        },
        allowNull: false,
    },
    typeFile: {
        type: DataTypes.ENUM,
        values: ['IVA','ICA','RTE'],
        allowNull: false,
        field: 'type_file'
    },
    archivoPdf: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'archivo_pdf'
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
    modelName: 'Certificates',
    tableName: 'certificates',
    timestamps: true 
});

export default Certificates;