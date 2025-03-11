/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND! Instead, modify the source JSON Schema file,
 * and run 'npm run generate-types' to regenerate this file.
 */

export type HttpsSuperflytvGithubIoGraphicsDataDefinitionGddMetaSchemaV1LibObjectJson =
  CoreAndValidationSpecificationsMetaSchema &
    HttpsSuperflytvGithubIoGraphicsDataDefinitionGddMetaSchemaV1LibGddTypesJson &
    HttpsSuperflytvGithubIoGraphicsDataDefinitionGddMetaSchemaV1LibBasicTypesJson & {
      type: "boolean" | "string" | "number" | "integer" | "array" | "object";
      gddType?: string;
      gddOptions?: {
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
export type CoreAndValidationSpecificationsMetaSchema =
  CoreVocabularyMetaSchema &
    ApplicatorVocabularyMetaSchema &
    UnevaluatedApplicatorVocabularyMetaSchema &
    ValidationVocabularyMetaSchema &
    MetaDataVocabularyMetaSchema &
    FormatVocabularyMetaSchemaForAnnotationResults &
    ContentVocabularyMetaSchema & {
      /**
       * @deprecated
       */
      definitions?: {
        [k: string]: {
          [k: string]: unknown;
        };
      };
      /**
       * @deprecated
       */
      dependencies?: {
        [k: string]:
          | {
              [k: string]: unknown;
            }
          | string[];
      };
      /**
       * @deprecated
       */
      $recursiveAnchor?: string;
      /**
       * @deprecated
       */
      $recursiveRef?: string;
      [k: string]: unknown;
    } & (
      | {
          /**
           * @deprecated
           */
          definitions?: {
            [k: string]: {
              [k: string]: unknown;
            };
          };
          /**
           * @deprecated
           */
          dependencies?: {
            [k: string]:
              | {
                  [k: string]: unknown;
                }
              | string[];
          };
          /**
           * @deprecated
           */
          $recursiveAnchor?: string;
          /**
           * @deprecated
           */
          $recursiveRef?: string;
          [k: string]: unknown;
        }
      | boolean
    );
export type CoreVocabularyMetaSchema = {
  $id?: string;
  $schema?: string;
  $ref?: string;
  $anchor?: string;
  $dynamicRef?: string;
  $dynamicAnchor?: string;
  $vocabulary?: {
    [k: string]: boolean;
  };
  $comment?: string;
  $defs?: {
    [k: string]: {
      [k: string]: unknown;
    };
  };
  [k: string]: unknown;
} & (
  | {
      $id?: string;
      $schema?: string;
      $ref?: string;
      $anchor?: string;
      $dynamicRef?: string;
      $dynamicAnchor?: string;
      $vocabulary?: {
        [k: string]: boolean;
      };
      $comment?: string;
      $defs?: {
        [k: string]: {
          [k: string]: unknown;
        };
      };
      [k: string]: unknown;
    }
  | boolean
);
export type ApplicatorVocabularyMetaSchema = {
  /**
   * @minItems 1
   */
  prefixItems?: [
    {
      [k: string]: unknown;
    },
    ...{
      [k: string]: unknown;
    }[],
  ];
  items?: {
    [k: string]: unknown;
  };
  contains?: {
    [k: string]: unknown;
  };
  additionalProperties?: {
    [k: string]: unknown;
  };
  properties?: {
    [k: string]: {
      [k: string]: unknown;
    };
  };
  patternProperties?: {
    [k: string]: {
      [k: string]: unknown;
    };
  };
  dependentSchemas?: {
    [k: string]: {
      [k: string]: unknown;
    };
  };
  propertyNames?: {
    [k: string]: unknown;
  };
  if?: {
    [k: string]: unknown;
  };
  then?: {
    [k: string]: unknown;
  };
  else?: {
    [k: string]: unknown;
  };
  /**
   * @minItems 1
   */
  allOf?: [
    {
      [k: string]: unknown;
    },
    ...{
      [k: string]: unknown;
    }[],
  ];
  /**
   * @minItems 1
   */
  anyOf?: [
    {
      [k: string]: unknown;
    },
    ...{
      [k: string]: unknown;
    }[],
  ];
  /**
   * @minItems 1
   */
  oneOf?: [
    {
      [k: string]: unknown;
    },
    ...{
      [k: string]: unknown;
    }[],
  ];
  not?: {
    [k: string]: unknown;
  };
  [k: string]: unknown;
} & (
  | {
      /**
       * @minItems 1
       */
      prefixItems?: [
        {
          [k: string]: unknown;
        },
        ...{
          [k: string]: unknown;
        }[],
      ];
      items?: {
        [k: string]: unknown;
      };
      contains?: {
        [k: string]: unknown;
      };
      additionalProperties?: {
        [k: string]: unknown;
      };
      properties?: {
        [k: string]: {
          [k: string]: unknown;
        };
      };
      patternProperties?: {
        [k: string]: {
          [k: string]: unknown;
        };
      };
      dependentSchemas?: {
        [k: string]: {
          [k: string]: unknown;
        };
      };
      propertyNames?: {
        [k: string]: unknown;
      };
      if?: {
        [k: string]: unknown;
      };
      then?: {
        [k: string]: unknown;
      };
      else?: {
        [k: string]: unknown;
      };
      /**
       * @minItems 1
       */
      allOf?: [
        {
          [k: string]: unknown;
        },
        ...{
          [k: string]: unknown;
        }[],
      ];
      /**
       * @minItems 1
       */
      anyOf?: [
        {
          [k: string]: unknown;
        },
        ...{
          [k: string]: unknown;
        }[],
      ];
      /**
       * @minItems 1
       */
      oneOf?: [
        {
          [k: string]: unknown;
        },
        ...{
          [k: string]: unknown;
        }[],
      ];
      not?: {
        [k: string]: unknown;
      };
      [k: string]: unknown;
    }
  | boolean
);
export type UnevaluatedApplicatorVocabularyMetaSchema = {
  unevaluatedItems?: {
    [k: string]: unknown;
  };
  unevaluatedProperties?: {
    [k: string]: unknown;
  };
  [k: string]: unknown;
} & (
  | {
      unevaluatedItems?: {
        [k: string]: unknown;
      };
      unevaluatedProperties?: {
        [k: string]: unknown;
      };
      [k: string]: unknown;
    }
  | boolean
);
export type ValidationVocabularyMetaSchema = {
  type?:
    | (
        | "array"
        | "boolean"
        | "integer"
        | "null"
        | "number"
        | "object"
        | "string"
      )
    | [
        (
          | "array"
          | "boolean"
          | "integer"
          | "null"
          | "number"
          | "object"
          | "string"
        ),
        ...(
          | "array"
          | "boolean"
          | "integer"
          | "null"
          | "number"
          | "object"
          | "string"
        )[],
      ];
  const?: unknown;
  enum?: unknown[];
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxContains?: number;
  minContains?: number;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  dependentRequired?: {
    [k: string]: string[];
  };
  [k: string]: unknown;
} & (
  | {
      type?:
        | (
            | "array"
            | "boolean"
            | "integer"
            | "null"
            | "number"
            | "object"
            | "string"
          )
        | [
            (
              | "array"
              | "boolean"
              | "integer"
              | "null"
              | "number"
              | "object"
              | "string"
            ),
            ...(
              | "array"
              | "boolean"
              | "integer"
              | "null"
              | "number"
              | "object"
              | "string"
            )[],
          ];
      const?: unknown;
      enum?: unknown[];
      multipleOf?: number;
      maximum?: number;
      exclusiveMaximum?: number;
      minimum?: number;
      exclusiveMinimum?: number;
      maxLength?: number;
      minLength?: number;
      pattern?: string;
      maxItems?: number;
      minItems?: number;
      uniqueItems?: boolean;
      maxContains?: number;
      minContains?: number;
      maxProperties?: number;
      minProperties?: number;
      required?: string[];
      dependentRequired?: {
        [k: string]: string[];
      };
      [k: string]: unknown;
    }
  | boolean
);
export type MetaDataVocabularyMetaSchema = {
  title?: string;
  description?: string;
  default?: unknown;
  deprecated?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  examples?: unknown[];
  [k: string]: unknown;
} & (
  | {
      title?: string;
      description?: string;
      default?: unknown;
      deprecated?: boolean;
      readOnly?: boolean;
      writeOnly?: boolean;
      examples?: unknown[];
      [k: string]: unknown;
    }
  | boolean
);
export type FormatVocabularyMetaSchemaForAnnotationResults = {
  format?: string;
  [k: string]: unknown;
} & (
  | {
      format?: string;
      [k: string]: unknown;
    }
  | boolean
);
export type ContentVocabularyMetaSchema = {
  contentEncoding?: string;
  contentMediaType?: string;
  contentSchema?: {
    [k: string]: unknown;
  };
  [k: string]: unknown;
} & (
  | {
      contentEncoding?: string;
      contentMediaType?: string;
      contentSchema?: {
        [k: string]: unknown;
      };
      [k: string]: unknown;
    }
  | boolean
);
export type HttpsSuperflytvGithubIoGraphicsDataDefinitionGddMetaSchemaV1LibGddTypesJson =
  {
    [k: string]: unknown;
  };
export type HttpsSuperflytvGithubIoGraphicsDataDefinitionGddMetaSchemaV1LibBasicTypesJson =
  {
    [k: string]: unknown;
  };

export interface Http1270018084JsonSchemaV1RendererManifestSchemaJson {
  /**
   * Reference to the JSON-schema
   */
  $schema?: "https://superflytv.github.io/tmp-GraphicsDefinition/definition/definition/json-schema/v1/renderer-manifest/schema.json";
  /**
   * The id of the Renderer.
   */
  id: string;
  /**
   * Name of the Renderer. This is displayed to the User.
   */
  name: string;
  /**
   * Custom Actions that can be invoked on the Renderer.
   */
  actions: {
    [k: string]: Http1270018084JsonSchemaV1LibActionJson;
  };
  /**
   * The different RenterTargets this Renderer can render to.
   */
  renderTargets: {
    /**
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` ".".
     */
    [k: string]: {
      /**
       * The name of the RenderTarget. This is displayed to the User.
       */
      name: string;
      /**
       * A longer description of the RenderTarget. This is displayed to the User.
       */
      description?: string;
      [k: string]: unknown;
    };
  };
  /**
   * This interface was referenced by `Http1270018084JsonSchemaV1RendererManifestSchemaJson`'s JSON-Schema definition
   * via the `patternProperty` "^v_.*".
   */
  [k: string]: unknown;
}
/**
 * This interface was referenced by `undefined`'s JSON-Schema definition
 * via the `patternProperty` ".".
 */
export interface Http1270018084JsonSchemaV1LibActionJson {
  /**
   * The name of the action. This is displayed to the user.
   */
  label: string;
  /**
   * A longer description of the action. This is displayed to the user.
   */
  description?: string;
  /**
   * The schema of the action. This is used to validate the action parameters as well as auto-generate a GUI for the action.
   */
  schema: HttpsSuperflytvGithubIoGraphicsDataDefinitionGddMetaSchemaV1LibObjectJson;
  /**
   * This interface was referenced by `Http1270018084JsonSchemaV1LibActionJson`'s JSON-Schema definition
   * via the `patternProperty` "^v_.*".
   */
  [k: string]: unknown;
}
