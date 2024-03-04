import { ActorType } from './../typeDefs/Actores';
import { GraphQLBoolean, GraphQLID, GraphQLInputObjectType, GraphQLString , GraphQLInt, GraphQLFieldConfig} from 'graphql';
import { Actors } from '../Entities/Actors';
import { MessageType } from '../typeDefs/Message';

export const CREATE_ACTOR = {
    
    type: ActorType,
    
    args: {
        name: {type: GraphQLString},
        birthday: {type: GraphQLString},
        movies: {type: GraphQLString}
    },
    
    async resolve(_: any, args: any) {
        
        const { name, birthday, movies } = args;

        const res = await Actors.create({
            name,
            birthday,
            movies
        }).save();
        
        return res;

    }

};

export const DELETE_ACTOR = {
    type: GraphQLBoolean,
    args: {
        id: {type: GraphQLID}
    },
    async resolve(_: any, {id}: any){
        const res = await Actors.delete(id);
        if ( res.affected === 1 ) return true;
        return false;
    }
};

export const DELETE_ALL_ACTORS = {
    type: GraphQLBoolean,
    async resolve() {
        try {
            await Actors.delete({});
            return true;
        } catch (error) {
            console.error("Error al eliminar todos los actores:", error);
            return false;
        }
    }
};

export const DELETE_ACTORS_BY_RANGE: GraphQLFieldConfig<any, any, { startId: number, endId: number }> = {
    type: GraphQLBoolean,
    args: {
        startId: { type: GraphQLInt },
        endId: { type: GraphQLInt }
    },
    async resolve(_: any, { startId, endId }: { startId: number, endId: number }) {
        try {
            await Actors.createQueryBuilder()
                .delete()
                .where("id >= :startId AND id <= :endId", { startId, endId })
                .execute();
            return true;
        } catch (error) {
            console.error("Error al eliminar actores por rango de ID:", error);
            return false;
        }
    }
};

export const UPDATE_ACTOR = {
    type: MessageType,
    args: {
        id: { type: GraphQLID },
        input: {
            type: new GraphQLInputObjectType({
                name: "ActorInput",
                fields: {
                    name: { type: GraphQLString },
                    birthday: { type: GraphQLString },
                    movies: { type: GraphQLString }
                }
            })
        }
    },
    async resolve(_: any, { id, input }: any) {

        const actorFound = await Actors.findOne(id);

        if (!actorFound) return {
            success: false,
            message: "Actor no encontrado"
        };

        const { name, birthday, movies } = input;

        const updatedFields: any = {};
        if (name) updatedFields.name = name;
        if (birthday) updatedFields.birthday = birthday;
        if (movies) updatedFields.movies = movies;

        const res = await Actors.update({ id }, updatedFields);

        if (res.affected === 1) {
            return {
                success: true,
                message: "Actor actualizado exitosamente"
            };
        } else {
            return {
                success: false,
                message: "Error al actualizar el actor"
            };
        }

    }
};

