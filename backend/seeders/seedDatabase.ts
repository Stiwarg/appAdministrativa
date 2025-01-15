import seedAdminUser from "./seedCreateAdminUser";
import seedCompany from "./seedCreateCompanyCesar";
import seedRoles from "./seedCreateRoles";

export const seedDatabase = async (): Promise<void> => {
    try {
        await seedRoles();
        await seedCompany();
        await seedAdminUser();
        console.log('Seeder ejecutado correctamente');
    } catch (error) {
        console.error('Error al ejecutar el seeder:', error);
    }
};


