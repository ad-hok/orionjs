import initItem from './initItem'
import {CreateModel, CloneOptions, Model} from '../types'
import resolveParam from './resolveParam'
import {validate, clean} from '@orion-js/schema'
import clone from './clone'
import modelToSchema from './modelToSchema'

interface GetSchemaOptions {
  omitModel?: boolean
}

const createModel: CreateModel = modelOptions => {
  const name = modelOptions.name
  let resolvedSchema = null
  let resolvedResolvers = null

  const getSchema = () => {
    if (!modelOptions.schema) return {}

    if (resolvedSchema) return resolvedSchema
    const schema = resolveParam(modelOptions.schema)

    resolvedSchema = modelToSchema(schema, model)
    return resolvedSchema
  }

  const getCleanSchema = () => {
    if (!modelOptions.schema) return {}

    if (resolvedSchema) return resolvedSchema
    const schema = resolveParam(modelOptions.schema)

    resolvedSchema = modelToSchema(schema)
    return resolvedSchema
  }

  const getResolvers = () => {
    if (!modelOptions.resolvers) return {}

    if (resolvedResolvers) return resolvedResolvers
    resolvedResolvers = resolveParam(modelOptions.resolvers)
    return resolvedResolvers
  }

  const modelInitItem = (item: any): any => {
    const schema = getSchema()
    const resolvers = getResolvers()
    return initItem({schema, resolvers, name}, item)
  }

  const model: Model = {
    __isModel: true,
    name,
    getSchema,
    getCleanSchema,
    getResolvers,
    initItem: modelInitItem,
    validate: async doc => {
      const schema = getSchema()
      return await validate(schema, doc)
    },
    clean: async doc => {
      const schema = getSchema()
      return await clean(schema, doc)
    },
    clone: (cloneOptions: CloneOptions) => {
      return clone(
        {
          createModel,
          getSchema,
          getResolvers
        },
        cloneOptions
      )
    }
  }

  return model
}

export default createModel
