import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { GET_ALL_USERS, GET_USER } from './Queries/User';
import { CREATE_USER, DELETE_USER, LOGIN_USER } from './Mutations/Users';
import { GET_ALL_ACTORS, GET_ACTOR,GET_ACTOR_BY_NAME, GET_ACTOR_BY_MOVIE_NAME, GET_ACTORS_BY_ABC} from './Queries/Actores';
import { CREATE_ACTOR, DELETE_ACTOR, UPDATE_ACTOR, DELETE_ALL_ACTORS, DELETE_ACTORS_BY_RANGE} from './Mutations/Actores';

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        getAllUsers: GET_ALL_USERS,
        getUser: GET_USER,
        
        getAll: GET_ALL_ACTORS, // tiene paginacion
        getActor: GET_ACTOR,
        getActorByMovie: GET_ACTOR_BY_MOVIE_NAME,
        getActorByName: GET_ACTOR_BY_NAME,
        getActorByABC: GET_ACTORS_BY_ABC //tiene paginacion
    }
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createUser: CREATE_USER,
        deleteUser: DELETE_USER,
        loginUser:LOGIN_USER,

        createActor: CREATE_ACTOR,
        deleteActor: DELETE_ACTOR,
        updateActor: UPDATE_ACTOR,
        deleteAllActors: DELETE_ALL_ACTORS,
        deleteActorsByRange: DELETE_ACTORS_BY_RANGE

    }
});

export const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});