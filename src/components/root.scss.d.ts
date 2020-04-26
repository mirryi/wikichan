declare namespace RootScssModule {
  export interface IRootScss {
    header: string;
    results: string;
    title: string;
    top: string;
  }
}

declare const RootScssModule: RootScssModule.IRootScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: RootScssModule.IRootScss;
};

export = RootScssModule;
