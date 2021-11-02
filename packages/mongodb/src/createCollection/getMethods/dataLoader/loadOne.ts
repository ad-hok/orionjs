import {Collection, DataLoader} from '../../../types'

export default function <ModelClass>(collection: Collection) {
  const loadOne: DataLoader.LoadOne<ModelClass> = async options => {
    const [result] = await collection.loadData(options)
    return result
  }

  return loadOne
}
