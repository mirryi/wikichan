import * as React from "react";
import { ChangeEvent, Component, ReactNode } from "react";
import styles from "./search.module.scss";

export interface SearchProps {
  placeholderText: string;
  callback: (searchValue: string) => void;
}

export class SearchComponent extends Component<SearchProps> {
  callback: (e: ChangeEvent<HTMLInputElement>) => void;

  constructor(props: Readonly<SearchProps>) {
    super(props);

    this.callback = (e: ChangeEvent<HTMLInputElement>): void => {
      this.props.callback(e.target.value);
    };
  }

  render(): ReactNode {
    return (
      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder={this.props.placeholderText}
          onChange={this.callback}
        />
      </div>
    );
  }
}
