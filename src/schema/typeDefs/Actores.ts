import { GraphQLObjectType, GraphQLString, GraphQLID } from 'graphql';

export const ActorType = new GraphQLObjectType({
    name: "Actor",
    fields: {
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        birthday: {type: GraphQLString},
        movies: {type: GraphQLString}
    }
});
