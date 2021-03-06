const { GraphQLList } = require('graphql')
const { defaultArgs, defaultListArgs } = require('graphql-sequelize')

const createResolver = require('../createResolver')
const { injectAssociations } = require('./associationsFields')
/**
 * Returns a root `GraphQLObjectType` used as query for `GraphQLSchema`.
 *
 * It creates an object whose properties are `GraphQLObjectType` created
 * from Sequelize models.
 * @param {*} models The sequelize models used to create the root `GraphQLSchema`
 */
module.exports = function generateListResolver(
  modelType,
  modelTypeName,
  allSchemaDeclarations,
  outputTypes,
  models,
  globalPreCallback
) {
  const schemaDeclaration = allSchemaDeclarations[modelType.name]

  if (!schemaDeclaration.model) {
    throw new Error(
      `You provided an empty/undefined model for the endpoint ${modelType}. Please provide a Sequelize model.`
    )
  }

  return {
    type: new GraphQLList(
      injectAssociations(
        modelType,
        allSchemaDeclarations,
        outputTypes,
        models,
        globalPreCallback
      )
    ),
    args: {
      ...defaultArgs(schemaDeclaration.model),
      ...defaultListArgs(),
      ...(schemaDeclaration.list && schemaDeclaration.list.extraArg
        ? schemaDeclaration.list.extraArg
        : {})
    },
    resolve: createResolver(schemaDeclaration, models, globalPreCallback)
  }
}
