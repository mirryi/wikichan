declare namespace ItemScssModule {
  export interface IItemScss {
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

declare const ItemScssModule: ItemScssModule.IItemScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ItemScssModule.IItemScss;
};

export = ItemScssModule;
