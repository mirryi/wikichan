declare namespace FloatModuleScssModule {
  export interface IFloatModuleScss {
    frame: string;
  }
}

declare const FloatModuleScssModule: FloatModuleScssModule.IFloatModuleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: FloatModuleScssModule.IFloatModuleScss;
};

export = FloatModuleScssModule;
