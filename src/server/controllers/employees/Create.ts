import { Request, Response } from 'express';
import { validation } from '../../shared/middlewares';
import { typeEmployee } from '../../database/models';
import { employeeProviders } from '../../database/providers/Employees';

import * as yup from 'yup';

// VALIDADE QUERY
const queryPropSchema = yup.object({
    idCompany: yup.number().notRequired(),
});

type typeQueryProps = yup.InferType<typeof queryPropSchema>;

// BODY VALIDATION
type typeBodyColaborator = Omit<typeEmployee, 'id' | 'id_user'>;

export const createValidation = validation((getSchema) => ({
    query: getSchema<typeQueryProps>(queryPropSchema),
    body: getSchema<typeBodyColaborator>(
        yup.object({
            first_name: yup.string().required().min(3).max(150),
            last_name: yup.string().optional().min(3).max(150),
            cpf: yup.string().required().min(11),
            email: yup.string().optional().email().min(5),
            role: yup.string().optional(),
            workload: yup.string().optional(),
        }),
    ),
}));

// CREATE A EMPLOYEE
export const create = async (req: Request<{}, {}, typeEmployee, typeQueryProps>, res: Response) => {
    // Check the querry
    if (!req.query.idCompany) {
        return res.status(400).json({
            errors: {
                default: 'O parâmetro "idCompany" precisa ser informado.',
            },
        });
    }

    // Call the provider
    const result = await employeeProviders.create(
        {
            ...req.body,
            id_user: Number(req.headers.IdUser),
        },
        Number(req.query.idCompany),
    );

    // Verify instance of error
    if (result instanceof Error) {
        return res.status(500).json({
            errors: {
                default: result.message,
            },
        });
    }

    return res
        .status(201)
        .json({ result: 'CREATED A COLABORATOR NEW COLABORATOR', return: result });
};
