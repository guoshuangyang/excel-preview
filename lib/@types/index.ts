import { ColType, RowType } from "./data/index";

export declare type Container = HTMLElement | string;
export declare interface ExcelData {
  rows: RowType[];
  cols: ColType[];
  data?: any[][];
}
