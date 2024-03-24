import { testServer } from '../jest.setup';

describe('Collaborators - Delete', () => {
    let accessToken = '';

    beforeAll(async () => {
        await testServer.post('/register').send({
            user_name: 'testserver',
            first_name: 'Test',
            last_name: 'Server',
            cpf: '12345678911',
            email: 'test-server@email.com',
            password_hash: '1234567',
        });

        const loginUser = await testServer.post('/login').send({
            user_name: 'testserver',
            password_hash: '1234567',
        });

        accessToken = loginUser.body.accessToken;

        const collaborators = [
            {
                first_name: 'teste1',
                last_name: 'test1',
                cpf: '78954252151',
                email: 'test1@email.com',
            },
            {
                first_name: 'teste2',
                last_name: 'test2',
                cpf: '78954252151',
                email: 'test2@email.com',
            },
            {
                first_name: 'teste3',
                last_name: 'test3',
                cpf: '78954252151',
                email: 'test3@email.com',
            },
        ];

        const collaborator1 = await testServer
            .post('/collaborators')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send(collaborators[0]);

        const collaborator2 = await testServer
            .post('/collaborators')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send(collaborators[1]);

        const collaborator3 = await testServer
            .post('/collaborators')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send(collaborators[2]);
    });

    test('Should get a collaborator by id', async () => {
        const res = await testServer
            .get(`/collaborators/1`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('result');
        expect(res.body).toHaveProperty('result.id');
        expect(res.body).toHaveProperty('result.first_name');
        expect(res.body).toHaveProperty('result.email');
        expect(res.body).toHaveProperty('result.id_user');
        expect(res.body).toHaveProperty('result.created_at');
        expect(res.body).toHaveProperty('result.updated_at');
    });

    test('Should not get all without a token', async () => {
        const res = await testServer.get(`/collaborators`).send();

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('errors.default');
    });
});
