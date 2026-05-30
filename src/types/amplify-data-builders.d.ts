// src/types/amplify-data-builders.d.ts
declare module 'amplify-data-builders' {
  // Minimal function types for the builder DSL used in generated files.
  // You can refine these shapes later with real properties.

  /** A callback that receives an index-builder argument */
  export type SecondaryIndexBuilder = (idx: {
    (indexName: string): {
      name: (s: string) => any;
      queryField: (s: string) => any;
      [k: string]: any;
    };
    [k: string]: any;
  }) => any;

  /** A callback that receives an authorization-builder argument */
  export type AuthorizationBuilder = (allow: {
    (rule: string): {
      allow: (s: string) => any;
      provider?: (s: string) => any;
      operations?: (ops: string[]) => any;
      [k: string]: any;
    };
    [k: string]: any;
  }) => any;

  /** Generic field builder callback */
  export type FieldBuilder = (field: {
    (name: string): {
      type: (t: string) => any;
      isRequired?: (b: boolean) => any;
      [k: string]: any;
    };
    [k: string]: any;
  }) => any;

  /** Generic fallback builder */
  export type GenericBuilder<T = any> = (arg: T) => any;
}
