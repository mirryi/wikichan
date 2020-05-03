declare namespace ItemModuleScssModule {
  export interface IItemModuleScss {
    bold: string;
    content: string;
    description: string;
    extra: string;
    extraSummary: string;
    header: string;
    link: string;
    list: string;
    listItem: string;
    longDescription: string;
    providerName: string;
    searchTerm: string;
    tag: string;
    title: string;
    top: string;
  }
}

declare const ItemModuleScssModule: ItemModuleScssModule.IItemModuleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ItemModuleScssModule.IItemModuleScss;
};

export = ItemModuleScssModule;
