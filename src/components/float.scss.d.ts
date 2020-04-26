declare namespace FloatScssModule {
  export interface IFloatScss {
    frame: string;
  }
}

declare const FloatScssModule: FloatScssModule.IFloatScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: FloatScssModule.IFloatScss;
};

export = FloatScssModule;
