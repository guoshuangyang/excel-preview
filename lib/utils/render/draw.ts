import { fabric } from "fabric";
import { optionsType } from "~/@types/data";
import {
  defaultCellBorderWidth,
  defaultCellBorderColor,
  defaultLeftNumberWidth,
  defaultTopNumberHeight,
} from "~/utils/constant";
import {
  DrawLeftNumber,
  DrawTopLeft,
  DrawTopMenu,
} from "~/utils/render/drawNumber";

// 根据rows和cols渲染线段
function drawLineByData(canvas: fabric.Canvas, options: optionsType) {
  // 暂停渲染
  canvas.renderOnAddRemove = false;
  let rowLines: fabric.Line[] = [];
  let colLines: fabric.Line[] = [];
  let colsHeight = options.cols.reduce((total, col) => {
    return total + col.height + defaultCellBorderWidth;
  }, defaultTopNumberHeight);

  let xLength = defaultLeftNumberWidth;
  for (let i = 0; i <= options.rows.length; i++) {
    const rowLine = new fabric.Line([xLength, 0, xLength, colsHeight], {
      stroke: defaultCellBorderColor,
      strokeWidth: defaultCellBorderWidth,
      selectable: false,
      evented: false,
    });
    canvas.add(rowLine);
    rowLines.push(rowLine);
    if (i === options.rows.length) {
      break;
    }
    // 为options.rows添加x和y属性
    options.rows[i].x = xLength;
    xLength += options.rows[i]?.width + defaultCellBorderWidth;
  }
  let yLength = defaultTopNumberHeight;
  for (let i = 0; i <= options.cols.length; i++) {
    const colLine = new fabric.Line([0, yLength, xLength, yLength], {
      stroke: defaultCellBorderColor,
      strokeWidth: defaultCellBorderWidth,
      selectable: false,
      evented: false,
    });
    canvas.add(colLine);
    colLines.push(colLine);
    if (i === options.cols.length) {
      break;
    }
    // 为options.cols添加x和y属性
    options.cols[i].y = yLength;
    yLength += options.cols[i]?.height + defaultCellBorderWidth;
  }

  // 恢复渲染
  canvas.renderOnAddRemove = true;
  canvas.requestRenderAll();
  return {
    rowLines,
    colLines,
  };
}

export const renderExcel = (canvas: fabric.Canvas, options: optionsType) => {
  // 禁用渲染
  canvas.renderOnAddRemove = false;
  // const tops = drawTopNumber(canvas, options);
  drawLineByData(canvas, options);
  let topNumber = new DrawTopMenu(canvas, options);
  let leftNumber = new DrawLeftNumber(canvas, options);
  let leftTopNumber = new DrawTopLeft(canvas);
  // 恢复渲染
  canvas.renderOnAddRemove = true;
  canvas.renderAll();
  return {
    topNumber,
    leftNumber,
    leftTopNumber,
  };
};
