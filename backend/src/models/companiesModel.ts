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
        field: 'name_company'
    },
    logo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'logo'
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