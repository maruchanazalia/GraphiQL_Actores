import { GraphQLBoolean, GraphQLID, GraphQLInputObjectType, GraphQLString } from 'graphql';
import { Users } from '../Entities/Users';
import { UserType } from '../typeDefs/User';
import { MessageType } from '../typeDefs/Message';
import bcrypt from 'bcryptjs';

export const CREATE_USER = {
    
    type: UserType,
    
    args: {
        name: {type: GraphQLString},
        username: {type: GraphQLString},
        password: {type: GraphQLString}
    },
    
    async resolve(_: any, args: any) {
        
        const { name, username, password } = args;

        const encryptPassword = await bcrypt.hash(password, 10);
        
        const res = await Users.insert({
            name: name,
            username: username,
            password: encryptPassword
        });
        
        return {...args, id: res.identifiers[0].id, password: encryptPassword};

    }

};

export const DELETE_USER = {
    type: GraphQLBoolean,
    args: {
        id: {type: GraphQLID}
    },
    async resolve(_: any, {id}: any){
        const res = await Users.delete(id);
        if ( res.affected === 1 ) return true;
        return false;
    }
};

export const UPDATE_USER = {
    type: MessageType,
    args: {
        id: {type: GraphQLID},
        input: {
            type: new GraphQLInputObjectType({
                name: "UserInput",
                fields: {
                    name: {type: GraphQLString},
                    username: {type: GraphQLString},
                    oldpassw: {type: GraphQLString},
                    newpassw: {type: GraphQLString}
                }
            })
        }
    },
    async resolve(_: any, {id, input}: any) {
        
        const userFound = await Users.findOne(id);

        if(!userFound) return {
            success: false,
            message: "Usuario no encontrado"
        };

        const isMatch = await bcrypt.compare(input.oldpassw, userFound.password);

        if(!isMatch) return {
            success: false,
            message: "contra inconrrecta"
        };

        const newPassword = await bcrypt.hash(input.newpassw, 10);

        const res = await Users.update({id}, {name: input.name, username: input.username, password: newPassword});

        if (res.affected === 1) {
            return {
                success: true,
                message: "Usuario entro con exito"
            };
        } else {
            return {
                success: false,
                message: "Eroor al cargar usuario"
            };
        }

    }
};

export const LOGIN_USER = {
    type: MessageType,
    args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString }
    },
    async resolve(_: any, { username, password }: any) {
        const userFound = await Users.findOne({ where: { username } });


        if (!userFound) {
            return {
                success: false,
                message: "Usuario no encontrado"
            };
        }

        const isMatch = await bcrypt.compare(password, userFound.password);

        if (!isMatch) {
            return {
                success: false,
                message: "Contraseña incorrecta"
            };
        }

        return {
            success: true,
            message: "Inicio de sesión exitoso"
        };
    }
};
