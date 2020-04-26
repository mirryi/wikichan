declare namespace ItemScssModule {
  export interface IItemScss {
    header: string;
    item: string;
    title: string;
    top: string;
  }
}

declare const ItemScssModule: ItemScssModule.IItemScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ItemScssModule.IItemScss;
};

export = ItemScssModule;
