import { EActions, TActionParams, TDataContext } from '../../ui-src/types'

export enum EConstants {
  METADATA_KEY_NAME = '$name',
  METADATA_KEYS_VERSION = '$version',
  PRESERVED_KEY_SYMBOL = '$',

  VALUE_KEY = '$value',
  TYPE_KEY = '$type',
  EXTENSIONS = '$extensions',
  TITLE_KEY = '$title',
  DESCRIPTION_KEY = '$description',

  DOT_PATH_DELIMITER = '.',
  TOKEN_NAME_DELIMITER = '/',

  DEFAULT_MODE = 'light',
  BASE_FONT_SIZE = 16,
}

export enum EDTFTypes {
  COLOR = 'color',
  DIMENSION = 'dimension',
  FONTFAMILY = 'fontFamily',
  FONTWEIGHT = 'fontWeight',
  DURATION = 'duration',
  NUMBER = 'number',
  SHADOW = 'shadow',
  BORDER = 'border',
  TRANSITION = 'transition',
  GRADIENT = 'gradient',
  STROKE = 'stroke',
  TYPOGRAPHY = 'typography',
}

export enum EDTFCompositeTypes {
  BORDER = 'border',
  TRANSITION = 'transition',
  SHADOW = 'shadow',
  GRADIENT = 'gradient',
  TYPOGRAPHY = 'typography',
}

export enum ETokenResolvedType {
  COLOR = 'COLOR',
  BOOLEAN = 'BOOLEAN',
  FLOAT = 'FLOAT',
  STRING = 'STRING',
  EFFECT = 'EFFECT',
}

export enum EExtensionProp {
  MODE = 'mode',
  ALPHA = 'alpha',
  HUE = 'hue', /* next iteration */
}

export enum EExtensionPropPath {
  MODE = '',
  ALPHA = '@',
  HUE = 'H', /* next iteration */
}

export const METADATA_KEYS = [
  EConstants.METADATA_KEY_NAME,
  EConstants.METADATA_KEYS_VERSION,
]

// export enum EExtensionKey {
//   // EXTENSION_TYPE_MODIFIER = 'modifier',
//   EXTENSION_TYPE_MODE = 'mode',
// }

export type TDesignTokenFormat = {
  $type: EDTFTypes,
  $value: string | { [key: string]: string | string[] },
  $description: string
  $title: string
  $extensions: TTokenExtensions
}

export type TExtensionTypeStyle = {
  [key: string]: any
}
export type TExtensionTypeMode = {
  [key: string]: string
}

export type TAction<T> = {
  type: EActions
  params?: TActionParams<T>,
}

export type TCollectionPayload = {
  name: string
  isReset: boolean
  payload: TJsonData
}

export type TJsonData = {
  kda: {
    context: TDataContext
  },
  $name: string,
  $version: `${number}.${number}.${number}`
}

/**
 * utils/core.ts
 */

export type TTokenBaseProps = {
  [EConstants.VALUE_KEY]: string
  [EConstants.TYPE_KEY]: TTokenData['type']
  [EConstants.EXTENSIONS]: TTokenExtensions
  [EConstants.TITLE_KEY]: string
  [EConstants.DESCRIPTION_KEY]: string
}

export type TPathData = {
  path: string
  value: string
}
export type TPreProcessedDataObject = TPathData[]

export type TProcessedData = {
  $metaData: {
    $collectionName: string,
    $modes: string[],
    $version: TJsonData['$version'],
  },
  $tokens: {
    [key: TTokenKey]: TTokenData
  }
}

type TExtensionGeneratorKeys = EExtensionProp.ALPHA | EExtensionProp.HUE
type TExtensionKeys = EExtensionProp.MODE | TExtensionGeneratorKeys


export type TExtension = {
  [key in TExtensionKeys]?: any
}
export type TExtensionGeneratorGroup = {
  [key: string]: TExtensionGeneratorValue
}
export type TExtensionGeneratorValue = {
  $value: TTokenData['value'],
  $base: string,
  $type?: TTokenData['type'], // added from token type
}
export type TTokenGeneratorProps = {
  [key in TExtensionGeneratorKeys]?: TExtensionGeneratorGroup
}
export type TTokenModeProps = {
  [EExtensionProp.MODE]: {
    [key: string]: string
  }
}
export interface TTokenExtensions extends TTokenGeneratorProps, TTokenModeProps { }
export type TTokenKey = string
export type TTokenData = {
  name: string,
  type: TDesignTokenFormat['$type'],
  title: string,
  description: string,
  value: string,
  prevValue: string,
  variableAlias?: VariableAlias,
  // fallbackValue?: any | null,
  key: string,
  parentKey: string,
  groupName: string,
  modifier: null | TExtensionGeneratorKeys,
  path: string,
  rootKey: string,
  extensions: TTokenExtensions | null
  isExtension: boolean,
}

export type TTokenMappedData = TTokenData & {
  isAlias: boolean
}

export type TPreMappedData = {
  source: TTokenMappedData[],
  aliases: TTokenData[],
  tokens: TTokenData[],
  styles: {
    texts: TextStyle[]
    effects: EffectStyle[]
  }
}

export type TTranspiledTokenData = {
  local: Variable[],
  tokens: TTokenData[],
  aliases: TTokenData[],
  sum: number,
}

export type TTokenMetaData = {
  collectionId: string
  modes: TTokenMetaData
}

export type TTranspiledCollectionData = {
  items: VariableCollection[]
}

export type TTranspiledData = {
  variables: TTranspiledTokenData,
  collections: TTranspiledCollectionData,
  styles: TPreMappedData['styles'],
  status: {
    tokens: {
      added: string[],
      failed: string[]
    }
  }
}

export type TCreateTokenMetaData = {
  collection: VariableCollection,
  metaData: TProcessedData['$metaData']
  allVariables: Variable[]
  styles: TPreMappedData['styles']
}

export type TValueForMode = {
  mode: VariableCollection['modes'][0]
  defaultMode: string
}

export type TTokenIterationArgs = {
  tokens: TTokenData[],
  collection: VariableCollection,
  data: TProcessedData,
  allVariables: Variable[]
  styles: TPreMappedData['styles']
  isSkipStyles?: boolean,
}

export type TRGBA = { r: number; g: number; b: number; a: number }

export type TFontProps = {
  fontFamily?: string,
  fontSize?: number,
  fontWeight?: string | number,
  letterSpacing?: string,
  lineHeight?: string | number,
}

export enum EDimensionUnitSymbol {
  REMS = 'rem',
  PIXELS = 'px',
  PERCENT = '%'
}

export enum EDimensionUnit {
  AUTO = 'AUTO',
  PIXELS = 'PIXELS',
  PERCENT = 'PERCENT'
}

export type TEffectProps = {
  color?: string,
  offsetX?: number,
  offsetY?: number,
  blur?: number,
  spread?: number
}

export type TStrokeStyle = "solid" | "dashed" | "dotted" | "double" | "groove" | "ridge" | "outset" | "inset"

export type TBorderProps = {
  color?: string,
  width?: string,
  style?: TStrokeStyle
}
