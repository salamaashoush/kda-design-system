import {
  EConstants,
  EDTFTypes,
  EDimensionUnit,
  EDimensionUnitSymbol,
  EExtensionProp,
  TFontProps,
  TPreMappedData,
  TTokenData
} from "../types";

export function getValueByPath(payloadData: any, path: string): any {
  const { sourceData } = payloadData
  const keys = path.split(EConstants.DOT_PATH_DELIMITER);
  let value = sourceData;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }

  return value;
}

export type TDeconstructPath = {
  refKey: string
  rootKey: string
  key: string
  parentKey: string
  groupName: string
  isExtension: boolean
}

export function deconstructPath(path: string[] | string): TDeconstructPath {
  if (typeof path === 'string') {
    path = path.split(EConstants.DOT_PATH_DELIMITER)
  }

  const [key, parentKey, groupName, rootKey, refKey] = [...path].reverse()
  const isExtension = path.includes(EConstants.EXTENSIONS)
  return {
    refKey,
    rootKey,
    key,
    parentKey,
    groupName,
    isExtension,
  }
}

export function loadAllStyles(styles: TPreMappedData['styles']) {
  const allEffects = figma.getLocalEffectStyles()
  const allTexts = figma.getLocalTextStyles()

  styles.effects = [...allEffects]
  styles.texts = [...allTexts]

  return styles
}

export function setVariableDataType(type: string) {
  return type?.toUpperCase() as EDTFTypes
}

export function convertPathToName(path: string) {
  return path
    ?.trim()
    .replace(new RegExp(/\.\$value$/), '')
    .replace(/\./g, EConstants.TOKEN_NAME_DELIMITER)
}

export function convertPropPath(path: string, value = '') {
  return path
    ?.trim()
    .split(EConstants.TOKEN_NAME_DELIMITER)
    .filter((part) => part !== EConstants.EXTENSIONS)
    .map((part) => [EExtensionProp.ALPHA, EExtensionProp.HUE].includes(part as EExtensionProp) ? value : part)
    .join(EConstants.TOKEN_NAME_DELIMITER)
}

export function transformExtentionPropFallbackPath(path: string) {
  const [fallbackPath] = path?.trim().split(EConstants.EXTENSIONS)

  return fallbackPath
    .split(EConstants.DOT_PATH_DELIMITER)
    .filter(d => d)
    .join(EConstants.TOKEN_NAME_DELIMITER)
}

export const hasAliasValue = (value: string) =>
  typeof value === 'string' &&
  /\{[^.]+\.+[^}]+\}$/.test(value)

export const hasExtendedAliasValue = (value: VariableValue) =>
  typeof value === 'string' &&
  value.includes(`.${EConstants.EXTENSIONS}.`)

export const getExtendedAliasValue = (value: VariableValue) => {
  if (typeof value === 'string' && hasExtendedAliasValue(value)) {
    return transformExtendedAliasPath(value)
  }

  return null
}

export const transformExtendedAliasPath = (value: string) => {
  return getValuePath(value).split(EConstants.TOKEN_NAME_DELIMITER)
    .filter((part) => part !== EConstants.EXTENSIONS)
    .map((part) => [EExtensionProp.ALPHA, EExtensionProp.HUE].includes(part as EExtensionProp) ? EExtensionProp.ALPHA : part)
    .join(EConstants.TOKEN_NAME_DELIMITER)
}

export const getValuePath = (aliasValue: string) => {
  const path = convertPathToName(aliasValue.replace(/{|}/g, ''))
  const parts = path.split(EConstants.TOKEN_NAME_DELIMITER)
  const [lastPart] = [...parts].reverse()


  if (lastPart === EConstants.VALUE_KEY) {
    parts.pop()
  }

  return parts.join(EConstants.TOKEN_NAME_DELIMITER)
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const matchUnitRegex = /^(\d+(?:\.\d+)?)([a-zA-Z]+)$/

export function parseDimensionUnit(type: string, token: TTokenData, value: string | number, defaults = { unit: EDimensionUnit.AUTO }): { value?: number, unit: EDimensionUnit } {
  if (type === 'lineHeight' && typeof value === 'number') {
    value = `${((token.value as TFontProps).fontSize ?? 1) * value}${EDimensionUnitSymbol.PIXELS}`
  }

  const match = RegExp(matchUnitRegex).exec(String(value)) ?? [];
  const [, unitValue, unitMetric] = match

  if (match.length) {
    value = parseFloat(unitValue);
    let unit = unitMetric;

    switch (unit) {
      case EDimensionUnitSymbol.PERCENT:
        unit = EDimensionUnit.PERCENT
        break;
      case EDimensionUnitSymbol.PIXELS:
        unit = EDimensionUnit.PIXELS
        break;
      case EDimensionUnitSymbol.REMS:
        unit = EDimensionUnit.PIXELS
        value = value * EConstants.BASE_FONT_SIZE
        break;

      default:
        unit = EDimensionUnit.PIXELS
        break;
    }

    return { value, unit: unit as EDimensionUnit };
  }

  return defaults
}

export function parseFontSize(value: string | number): number {
  const match = RegExp(matchUnitRegex).exec(String(value)) ?? [];
  const [_originalValue, unitValue, unitMetric] = match

  if (match.length) {
    let value = parseFloat(unitValue);

    switch (unitMetric) {
      case EDimensionUnitSymbol.REMS:
        value = parseFloat(unitValue) * EConstants.BASE_FONT_SIZE
        break;

      case EDimensionUnitSymbol.PERCENT:
      case EDimensionUnitSymbol.PIXELS:
      default:
        break;
    }

    return value;
  } else if (value) {
    return Number(value)
  }

  return EConstants.BASE_FONT_SIZE
}
