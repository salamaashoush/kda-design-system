import { TAction, TCollectionPayload } from "../types";
import { iterateJson, processData } from "./core";
import { mapper } from '../utils/mappers/base'
import { getTypographyTokens } from "./composites/typography";

export async function init(data: TAction<TCollectionPayload>, isInit = true) {
  const { params } = data

  if (params?.payload) {
    const preProcessedData = iterateJson(params.payload);
    const processedData = await processData(preProcessedData, params.payload)
    const mappedData = await mapper(processedData, params as TCollectionPayload)

    if (!isInit && params.isImportTypography) {
      await getTypographyTokens(mappedData.status.tokens.typography, {
        allVariables: mappedData.variables.local,
        collection: mappedData.collections.items[0],
        data: processedData,
        payload: data.params?.payload,
        styles: mappedData.styles,
        tokens: mappedData.variables.tokens,
      }, params.payload)
    }

    if (isInit && Object.keys(processedData.$tokens).length !== mappedData.variables.local.length) {
      setTimeout(async () => {
        await init({
          ...data,
          params: {
            ...data.params,
            isReset: false,
          }
        }, false)
      }, 100);
    }
  }
}