import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { IRol } from '../interfaces/interface';

class Roles extends Model<IRol> implements IRol{
    public id!: number;
    public nameRol!: string; 
    public readonly createdAt!: Date;
    public updatedAt!: Date;
}

Roles.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED, // Entero sin signo
        primaryKey: true,
        autoIncrement: true, // Aumenta automáticamente, útil para claves primarias
        field: 'id' 
    },
    nameRol: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'name_rol'
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
    modelName: 'Roles',
    tableName: 'roles',
    timestamps: true
});

export default Roles;