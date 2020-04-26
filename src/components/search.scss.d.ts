declare namespace SearchScssModule {
  export interface ISearchScss {
    searchWrapper: string;
  }
}

declare const SearchScssModule: SearchScssModule.ISearchScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SearchScssModule.ISearchScss;
};

export = SearchScssModule;
