import { GraphQLID, GraphQLList , GraphQLString, GraphQLInt} from 'graphql';
import { Actors } from '../Entities/Actors';
import { ActorType } from "../typeDefs/Actores";


export const GET_ALL_ACTORS = {
    type: new GraphQLList(ActorType),
    args: {
        pageNumber: { type: GraphQLInt },
        pageSize: { type: GraphQLInt }
    },
    async resolve(_: any, { pageNumber = 1, pageSize = 10 }: { pageNumber: number, pageSize: number }) {
        const offset = (pageNumber - 1) * pageSize;
        const actors = await Actors.find({ 
            skip: offset,
            take: pageSize
        });
        return actors;
    }
};

export const GET_ACTOR = {
    type: ActorType,
    args: {
        id: {type: GraphQLID}
    },
    async resolve(_: any, args: any){
        return await Actors.findOne(args.id);
    }
};

export const GET_ACTOR_BY_NAME = {
    type: ActorType,
    args: {
        name: { type: GraphQLString }
    },
    async resolve(_: any, args: any) {
        return await Actors.findOne({ where: { name: args.name } });
    }
};

export const GET_ACTOR_BY_MOVIE_NAME = {
    type: new GraphQLList(ActorType),
    args: {
        movieName: { type: GraphQLString }
    },
    async resolve(_: any, args: { movieName: string }) {
        const { movieName } = args;
        return await Actors.find({ where: { movies: movieName } });
    }
};

export const GET_ACTORS_BY_ABC = {
    type: new GraphQLList(ActorType),
    args: {
        name: { type: GraphQLString },
        pageNumber: { type: GraphQLInt },
        pageSize: { type: GraphQLInt }
    },
    async resolve(_: any, { name, pageNumber = 1, pageSize = 10 }: { name: string, pageNumber: number, pageSize: number }) {
        const offset = (pageNumber - 1) * pageSize;
        const actors = await Actors.find({ 
            where: { name },
            order: { name: "ASC" },
            skip: offset,
            take: pageSize
        });
        return actors;
    }
};