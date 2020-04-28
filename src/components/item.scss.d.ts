declare namespace ItemScssModule {
  export interface IItemScss {
    content: string;
    description: string;
    extra: string;
    extraSummary: string;
    header: string;
    link: string;
    list: string;
    listItem: string;
    longDescription: string;
    searchTerm: string;
    tag: string;
    tags: string;
    title: string;
    top: string;
  }
}

declare const ItemScssModule: ItemScssModule.IItemScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ItemScssModule.IItemScss;
};

export = ItemScssModule;
