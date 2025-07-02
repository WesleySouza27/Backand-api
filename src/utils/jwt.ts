import jwtlib from 'jsonwebtoken';
import { envs } from '../envs';
import { HTTPError } from './http.error';
import { StringValue } from 'ms';

export class JWT {
    /**
     * Método para gerar um token JWT a partir de um objeto
     * 
     * @param data - Objeto JS que será utilizado para geração do token
     * @returns Token JWT do objeto enviado por parâmetro
     * 
     * Saiba mais em {@link https://jwt.io/}
     */
    public encoder<Type>(data: Type): string {
        if (!envs.JWT_SECRET) {
            throw new HTTPError(500, "Secret JWT not provided in env file");
        }

        const token = jwtlib.sign(data as object, envs.JWT_SECRET, {
            expiresIn: (envs.JWT_EXPIRE_IN ?? '1h') as StringValue,
        });

        return token;
    }

    /**
     * Método para converter um token JWT em um objeto JS
     * 
     * Saiba mais em {@link https://jwt.io/}
     */
    public decoder<Type>(token: string): Type {
        if (!envs.JWT_SECRET) {
            throw new HTTPError(500, "Secret JWT not provided in env file");
        }

        const data = jwtlib.verify(token, envs.JWT_SECRET);

        return data as Type;
    }
}