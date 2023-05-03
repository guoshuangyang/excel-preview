export declare interface Font {
  size?: number;
  color?: string;
  family?: string;
  weight?: string;
}

export declare type RowType = {
  width: number;
  borderColor: string;
  // 左上角的x坐标
  x: number;
  index: number;
  font?: Font;
};

export declare type ColType = {
  height: number;
  borderColor: string;
  // 左上角的y坐标
  y: number;
  index: number;
  font?: Font;
};

// 绘制线条 - 全局的线条，不处理单元格的线条
export declare type optionsType = {
  rows: RowType[];
  cols: ColType[];
};
