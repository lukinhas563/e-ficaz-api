import { EnumTableNames } from '../../ETablesNames';
import { Knex } from '../../knex';

export const getAll = async (
    page: number,
    limit: number,
    filter: string,
    IdUser: number,
    id = 0,
) => {
    try {
        const result = await Knex(EnumTableNames.collaborators)
            .select('*')
            .where('id', id)
            .orWhere('first_name', 'like', `%${filter}%`)
            .andWhere('id_user', IdUser)
            .offset((page - 1) * limit)
            .limit(limit);

        if (id > 0 && result.every((item) => item.id !== id)) {
            const resultById = await Knex(EnumTableNames.collaborators)
                .select('*')
                .where('id', '=', id)
                .first();

            if (resultById) return [...result, resultById];
        }

        return result;
    } catch (error) {
        console.log(error);

        return new Error('Erro ao localizar os registros.');
    }
};
