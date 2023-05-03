import { fabric } from "fabric";
import { optionsType } from "~/@types/data";
import {
  defaultTopNumberHeight,
  defaultTopNumberFill,
  defaultLeftNumberWidth,
} from "~/utils/constant";
import { generateRowIndex } from "~/utils/generate/string";

export const drawOneTopMenu = (
  canvas: fabric.Canvas,
  options: {
    width: number; // 宽度
    x: number; // 开始的x坐标
    index: number; // 从0开始的第几个
  }
) => {
  const rect = new fabric.Rect({
    width: options.width,
    height: defaultTopNumberHeight,
    fill: defaultTopNumberFill,
    strokeWidth: 0,
    selectable: false,
  });
  const text = new fabric.Text(generateRowIndex(options.index), {
    fontSize: 11,
    fontFamily: "宋体",
    fill: "#fff",
  });
  const group = new fabric.Group([rect, text], {
    left: options.x,
    top: 0,
    selectable: false,
    evented: false,
  });
  group.item(1).set({
    originX: "center",
    originY: "center",
    left: 0,
    top: 0,
  });
  // 层级拉高
  canvas.add(group);
  canvas.bringToFront(group);
  return group;
};

export const drawOneLeftMenu = (
  canvas: fabric.Canvas,
  options: {
    height: number; // 高度
    y: number; // 开始的y坐标
    index: number; // 从0开始的第几个
  }
) => {
  const rect = new fabric.Rect({
    width: defaultLeftNumberWidth,
    height: options.height,
    fill: defaultTopNumberFill,
    strokeWidth: 0,
    selectable: false,
  });
  const text = new fabric.Text(options.index + 1 + "", {
    fontSize: 11,
    fontFamily: "宋体",
    fill: "#fff",
  });
  const group = new fabric.Group([rect, text], {
    left: 0,
    top: options.y,
    selectable: false,
    evented: false,
  });
  group.item(1).set({
    originX: "center",
    originY: "center",
    left: 0,
    top: 0,
  });
  canvas.add(group);
  canvas.bringToFront(group);
  return group;
};
// drawTop
export const drawTopNumber = (canvas: fabric.Canvas, options: optionsType) => {
  const topNumbers = [];
  for (let i = 0; i < options.rows.length; i++) {
    const row = options.rows[i];
    const topNumber = drawOneTopMenu(canvas, {
      width: row.width,
      x: row.x,
      index: i,
    });
    topNumbers.push(topNumber);
  }
  return topNumbers;
};
// 渲染侧边
export const drawLeftNumber = (canvas: fabric.Canvas, options: optionsType) => {
  const leftNumbers = [];
  for (let i = 0; i < options.cols.length; i++) {
    const col = options.cols[i];
    const leftNumber = drawOneLeftMenu(canvas, {
      height: col.height,
      y: col.y,
      index: i,
    });
    leftNumbers.push(leftNumber);
  }
  return leftNumbers;
};

// 渲染左上角
export const drawLeftTopTable = (canvas: fabric.Canvas) => {
  // rect 只设定右边和下边的边框
  const rect = new fabric.Rect({
    width: defaultLeftNumberWidth - 0.5,
    height: defaultTopNumberHeight + 0.5,
    strokeWidth: 1,
    stroke: defaultTopNumberFill,
    fill: defaultTopNumberFill,
    selectable: false,
    left: 0,
    top: 0,
  });

  const group = new fabric.Group([rect], {
    left: 0,
    top: 0,
    selectable: false,
    evented: false,
  });
  canvas.add(group);
  canvas.bringToFront(group);
  return group;
};
