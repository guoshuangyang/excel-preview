import { ColType, RowType, optionsType } from "~/@types/data";
import {
  defaultCellBorderColor,
  defaultBorderWidth,
  defaultCellHeight,
  defaultCellWidth,
  defaultExcelRightBottomDistance,
  defaultLeftNumberWidth,
  defaultTopNumberHeight,
} from "~/utils/constant";

// 计算点击的那个单元格以及单元格的左上角和右下角的位置
export const calcWhichCell = (
  options: optionsType,
  pointer: { x: number; y: number }
) => {
  let xLength = defaultLeftNumberWidth;
  let yLength = defaultTopNumberHeight;
  let row = -1;
  let col = -1;
  if (pointer.x < defaultLeftNumberWidth) {
    row = -1;
  } else {
    for (let i = 0; i < options.rows.length; i++) {
      xLength += options.rows[i].width + defaultBorderWidth;
      row = i + 1;
      if (pointer.x < xLength) {
        row = i;
        break;
      }
    }
  }
  if (pointer.y < defaultTopNumberHeight) {
    col = -1;
  } else {
    for (let i = 0; i < options.cols.length; i++) {
      yLength += options.cols[i].height + defaultBorderWidth;
      col = i + 1;
      if (pointer.y < yLength) {
        col = i;
        break;
      }
    }
  }
  return {
    row,
    col,
  };
};

// 获取初始单元格（全部）的的右下角的x,y坐标(单元格右下角)
export const calcRxAndBy = (
  rows: RowType[],
  cols: ColType[]
): {
  rx: number; // 最右边的单元格的x坐标
  by: number; // 最下边的单元格的y坐标
  xLasterIndex: number; // 最右边的单元格的index
  yLasterIndex: number; // 最下边的单元格的index
} => {
  const lasterRow = rows[rows.length - 1];
  const lasterCol = cols[cols.length - 1];
  return {
    rx: lasterRow.x + lasterRow.width + defaultBorderWidth,
    by: lasterCol.y + lasterCol.height + defaultBorderWidth,
    xLasterIndex: rows.length - 1,
    yLasterIndex: cols.length - 1,
  };
};

// 计算当前画布的左侧所在的位置
export const calcViewport = (canvas: fabric.Canvas) => {
  // 获取左上和右下角相对可以动的画布的位置
  return canvas.calcViewportBoundaries();
};

// 计算当前的窗口应该渲染多少个临时rows和cols 默认除了当前视口的，还应该再渲染半屏幕的rows和cols
export const calcTempRowsAndCols = (
  canvas: fabric.Canvas,
  options: optionsType
) => {
  // 获取当前你的画布的左上角的相对位置
  let { tl, tr, bl } = calcViewport(canvas);
  let width = tr.x - tl.x;
  let height = bl.y - tl.y;
  // 计算这个屏幕可以应该渲染多少行
  let xNumber = Math.ceil((height / defaultCellHeight) * 2);
  // 计算这个屏幕可以应该渲染多少列
  let yNumber = Math.ceil((width / defaultCellWidth) * 2);
  // 根据最后一个单元格的位置
  let { rx, by, xLasterIndex, yLasterIndex } = calcRxAndBy(
    options.rows,
    options.cols
  );
  // 计算当前的屏幕应该渲染什么临时内容
  let tempRows: RowType[] = [];
  let tempCols: ColType[] = [];
  // 左侧渲染半个屏幕的临时的rows
  if (tl.x > rx + width * 1.1) {
    // 获取最左侧边界的靠近的单元格的index和x坐标
    const num = Math.ceil(
      (tl.x - rx) / (defaultCellWidth + defaultBorderWidth)
    );
    const xIndex = xLasterIndex + num;
    // 左侧应该渲染多少个临时的rows
    const firstX =
      (xIndex - Math.ceil(num - xNumber / 4) - xLasterIndex) *
      (defaultCellWidth + defaultBorderWidth);
    const firstIndex = xIndex - Math.ceil(num - xNumber / 4);
    // 计算临时的rows
    for (let i = 0; i < xNumber; i++) {
      tempRows.push({
        width: defaultCellWidth,
        borderColor: defaultCellBorderColor,
        x: firstX + i * defaultCellWidth,
        index: firstIndex + i,
      });
    }
  } else if (rx < tr.x + defaultExcelRightBottomDistance) {
    for (let i = 0; i < xNumber; i++) {
      tempRows.push({
        width: defaultCellWidth,
        borderColor: defaultCellBorderColor,
        x: rx + i * defaultCellWidth,
        index: xLasterIndex + i + 1,
      });
    }
  }
  // 上侧渲染半个屏幕的临时的cols
  if (tl.y > by + height * 1.1) {
    // 获取最上侧边界的靠近的单元格的index和y坐标
    const num = Math.ceil(
      (tl.y - by) / (defaultCellHeight + defaultBorderWidth)
    );
    const yIndex = yLasterIndex + num;
    // 上侧应该渲染多少个临时的cols
    const firstY =
      (yIndex - Math.ceil(num - yNumber / 4) - yLasterIndex) *
      (defaultCellHeight + defaultBorderWidth);
    const firstIndex = yIndex - Math.ceil(num - yNumber / 4);
    // 计算临时的cols
    for (let i = 0; i < yNumber; i++) {
      tempCols.push({
        height: defaultCellHeight,
        borderColor: defaultCellBorderColor,
        y: firstY + i * defaultCellHeight,
        index: firstIndex + i,
      });
    }
  }
  return {
    tempRows,
    tempCols,
  };
};
