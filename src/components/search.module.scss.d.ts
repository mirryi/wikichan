declare namespace SearchModuleScssModule {
  export interface ISearchModuleScss {
    searchWrapper: string;
  }
}

declare const SearchModuleScssModule: SearchModuleScssModule.ISearchModuleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SearchModuleScssModule.ISearchModuleScss;
};

export = SearchModuleScssModule;
