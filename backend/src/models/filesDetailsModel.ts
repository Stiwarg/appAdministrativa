import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import FilesExcels from '../models/filesExcelsModel';
import { IFileDetails } from '../interfaces/interface';
import Users from '../models/UsersModel';

class FilesDetails extends Model< IFileDetails > implements IFileDetails {
    public id!: number;
    public filesExcelsId!: number;
    public tpRete!: number;
    public userId!: number;
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
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'tp_rete',
        validate: {
            isInt: { msg: 'tpRete debe ser un numero entero válido'},
            notNull: { msg: 'El tp_rete es obligatorio'},
            min: { args: [0], msg: 'El tp_rete debe ser mayor o igual a 0'}
        }
    },
    userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'user_id',
        references: {
            model: Users,
            key: 'id'
        }
    },
    dv: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'dv',
        validate: {
            isInt: { msg: 'dv debe ser un número entero válido.'},
            notNull: { msg: 'El dv es obligatorio'},
            min: { args: [0], msg: 'El dv debe ser mayor o igual a 0'}
        }
    },
    nameCompany: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'name_company',
        validate: {
            notEmpty: { msg: 'El nombre de la compañia no puede estar vacio' },
            len: { args: [ 1, 200], msg: 'El nombre de la compañia debe tener entre 1 y 200 caracteres' },
            /*is: {
                args: /^[a-zA-Z0-9\s._-]*$/,
                msg:'El nombre de la compañia contiene caracteres no permitidos'
            }*/
        }
    },
    nameConcept: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'name_concept',
        validate: {
            notEmpty: { msg: 'El nombre de la compañia no puede estar vacio' },
            len: { args: [ 1, 200], msg: 'El nombre de la compañia debe tener entre 1 y 200 caracteres' },
            /*is: {
                args: /^[a-zA-Z0-9\s,._;:'"\-!()&*$@#^=+]*$/,
                msg:'El nombre de la compañia contiene caracteres no permitidos'
            }*/
        }
    },
    base: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'base',
        validate: {
            isInt: { msg: 'La base debe ser un número entero válido' },
            notNull: { msg: 'La base es obligatoria'},
            min: { args: [0], msg: 'La base debe ser mayor o igual a 0' },
            max: { args: [9999999999999999999999999999], msg: 'La base debe ser un número razonable y no exceder el límite de 30 dígitos' }
        }
    },
    valueRetained: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'value_retained',
        validate: {
            isInt: { msg: 'El valor retenido debe ser un número entero válido' },
            notNull: { msg: 'El valor retenido es obligatorio' },
            min: { args: [0], msg: 'La base debe ser mayor o igual a 0'  },
            max: {  args: [9999999999999999999999999999], msg: 'La base debe ser un número razonable y no exceder el límite de 30 dígitos' }
        }
    },
    percentage: {
        type: DataTypes.DECIMAL( 7,3 ),
        allowNull: false,
        field: 'percentage',
        validate: {
            isDecimal: { msg: 'El porcentaje debe ser un número decimal válido'},
            notNull: { msg: 'El porcentaje es obligatorio'},
            min: {  args: [0], msg: 'El porcentaje debe ser mayor o igual a 0' },
            max: { args: [100], msg: 'El porcentaje no puede ser mayor que 100' },
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
    modelName: 'FileDetails',
    tableName: 'fileDetails',
    timestamps: true
});

export default FilesDetails;