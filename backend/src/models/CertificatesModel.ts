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
        field: 'type_file',
        validate: {
            notNull: { msg: 'El tipo de archivo es obligatorio'},
            isIn:{
                args: [['IVA', 'ICA', 'RTE']],
                msg: 'El tipo de archivo debe ser uno de los siguientes: IVA, ICA, RTE'
            }
        }
    },
    archivoPdf: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'archivo_pdf',
        validate: {
            notEmpty: { msg: 'El nombre o la ruta del archivo PDF es obligatorio' },
            is: {
                args: /^[a-zA-Z0-9_\-\/\.]+\.pdf$/,
                msg: 'El archivo debe ser un PDF válido y terminar con ".pdf"'
            },
            len: {
                args: [ 3,255 ],
                msg: 'El nombre o la ruta del archivo debe tener entre 3 y 255 caracteres'
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
    modelName: 'Certificates',
    tableName: 'certificates',
    timestamps: true 
});

export default Certificates;