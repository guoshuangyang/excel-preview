import { ColType, RowType } from "./data";

export declare type Container = HTMLElement | string;
export declare interface ExcelData {
  rows: RowType[];
  cols: ColType[];
  data?: any[][];
}
