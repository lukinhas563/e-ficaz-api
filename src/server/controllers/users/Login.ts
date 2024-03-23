import { Request, Response } from 'express';
import { validation } from '../../shared/middlewares';
import { typeUser } from '../../database/models';

import * as yup from 'yup';
import { userProviders } from '../../database/providers/Users';
import { PasswordCrypto } from '../../shared/services';

type typeBodyProps = Omit<typeUser, 'first_name' | 'last_name' | 'cpf' | 'email' | 'id'>;

export const loginValidation = validation((getSchema) => ({
    body: getSchema<typeBodyProps>(
        yup.object({
            user_name: yup.string().required().min(3),
            password_hash: yup.string().required().min(3),
        }),
    ),
}));

export const login = async (req: Request<{}, {}, typeUser>, res: Response) => {
    const { user_name, password_hash } = req.body;
    const result = await userProviders.getByUsername(user_name);

    if (result instanceof Error) {
        return res.status(401).json({
            errors: {
                default: 'E-mail ou senha inválidos.',
            },
        });
    }

    const passwordMatch = await PasswordCrypto.verifyPassword(password_hash, result.password_hash);

    if (!passwordMatch) {
        return res.status(401).json({
            errors: {
                default: 'E-mail ou senha inválidos.',
            },
        });
    } else {
        return res.status(200).json({ accessToken: 'TOKEN.TEST' });
    }
};
