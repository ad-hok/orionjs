import {generateId} from '@orion-js/helpers'
import createCollection from '.'

describe('Test indexes', () => {
  it('Should create collection indexes correctly', async () => {
    const collection = createCollection({
      name: generateId(),
      indexes: [{keys: {a: 1}, options: {unique: true}}]
    })

    const results = await collection.createIndexesPromise

    expect(results).toEqual(['a_1'])
  })

  it('Should handle error when cant create indexes', async () => {
    const collectionName = generateId()
    const collection1 = createCollection({
      name: collectionName
    })

    await collection1.insertOne({a: 1})
    await collection1.insertOne({a: 1})

    console.error = jest.fn()

    const collection2 = createCollection({
      name: collectionName,
      indexes: [{keys: {a: 1}, options: {unique: true}}]
    })

    const result = await collection2.createIndexesPromise
    expect(result[0]).toEqual('E11000 duplicate key error dup key: { : 1 }')
    expect(console.error).toHaveBeenCalled()
  })

  it('Should log indexes that have to be deleted', async () => {
    const collectionName = generateId()
    const collection1 = createCollection({
      name: collectionName,
      indexes: [{keys: {a: 1}, options: {unique: true}}]
    })

    await collection1.createIndexesPromise

    console.warn = jest.fn()

    const collection2 = createCollection({
      name: collectionName,
      indexes: [{keys: {ba: 1}, options: {unique: true}}]
    })

    await collection2.createIndexesPromise

    expect(console.warn).toHaveBeenCalled()
  })

  it('Should upgrade a index correctly', async () => {
    const collectionName = generateId()
    const collection1 = createCollection({
      name: collectionName,
      indexes: [{keys: {name: 1}}]
    })

    await collection1.createIndexesPromise

    console.info = jest.fn()

    const collection2 = createCollection({
      name: collectionName,
      indexes: [{keys: {name: 1}, options: {unique: true}}]
    })

    await collection2.createIndexesPromise

    expect(console.warn).toHaveBeenCalled()
  })
})
