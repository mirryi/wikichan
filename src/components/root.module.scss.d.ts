declare namespace RootModuleScssModule {
  export interface IRootModuleScss {
    header: string;
    results: string;
    title: string;
    top: string;
    wrapper: string;
  }
}

declare const RootModuleScssModule: RootModuleScssModule.IRootModuleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: RootModuleScssModule.IRootModuleScss;
};

export = RootModuleScssModule;
