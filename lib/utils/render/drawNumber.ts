import { fabric } from "fabric";
import type { ColType, RowType, optionsType } from "~/@types/data";
import {
  defaultTopNumberHeight,
  defaultTopNumberFill,
  defaultFontSize,
  defaultFontFamily,
  defaultLeftNumberWidth,
  defaultCellBorderColor,
  defaultCellFontColor,
} from "~/utils/constant";
import { generateRowIndex } from "~/utils/generate/string";
import { calcViewport } from "../calc";

const renderTopNumber = (element: RowType, index: number, top: number = 0) => {
  const rect = new fabric.Rect({
    width: element.width,
    height: defaultTopNumberHeight,
    fill: defaultTopNumberFill,
    strokeWidth: 0,
    stroke: defaultCellBorderColor,
    selectable: false,
    originX: "center",
    originY: "center",
    top: 0,
    left: 0,
  });
  const text = new fabric.Text(generateRowIndex(index), {
    fontSize: defaultFontSize,
    fontFamily: defaultFontFamily,
    fill: defaultCellFontColor,
    originX: "center",
    originY: "center",
    top: 0,
    left: 0,
  });
  const group = new fabric.Group([rect, text], {
    left: element.x,
    top: top,
    selectable: false,
    evented: false,
  });
  return group;
};

export class DrawTopMenu {
  public canvas: fabric.Canvas;
  public options: optionsType;
  private groups: fabric.Group[] = [];
  private tmpGroups: fabric.Group[] = [];
  private tmpRows: RowType[] = [];

  constructor(canvas: fabric.Canvas, options: optionsType) {
    this.canvas = canvas;
    this.options = options;
    this.groups = [];
    this.tmpGroups = [];
    this.tmpRows = [];
    this.renderGroups();
  }

  // 渲染顶部的A-Z...
  renderGroups() {
    // 先移除所有的，再重新渲染
    if (this.groups) {
      this.groups.forEach((item) => {
        this.canvas.remove(item);
      });
      this.groups = [];
    }
    const { tl } = calcViewport(this.canvas);
    // 根据optionsType中的rows渲染
    for (let i = 0; i < this.options.rows.length; i++) {
      const element = this.options.rows[i];
      const group = renderTopNumber(element, i, tl.y);
      // 添加事件，鼠标移入，鼠标显示状态
      group.on("mouseover", () => {
        this.canvas.defaultCursor = "pointer";
      });
      this.groups.push(group);
      this.canvas.add(group);
      this.canvas.bringToFront(group);
    }
  }

  // 新增真实的数据
  addGroups(rows: RowType[]) {
    this.options.rows = [...this.options.rows, ...rows];
    this.renderGroups();
  }

  // 将所有的都移动在canvas的top为零的位置
  setTopZero() {
    this.renderGroups();
    this.addTemp(this.tmpRows);
  }

  // 新增临时的部分
  addTemp(rows: RowType[]) {
    this.tmpRows = rows;
    // 清楚临时的部分
    this.tmpGroups.forEach((group) => {
      this.canvas.remove(group);
    });
    this.tmpGroups = [];
    let { tl } = calcViewport(this.canvas);
    // 渲染顶部的A-Z...
    for (let j = 0; j < rows.length; j++) {
      const element = rows[j];
      const group = renderTopNumber(element, j, tl.y);
      this.tmpGroups.push(group);
      this.canvas.add(group);
      this.canvas.bringToFront(group);
    }
  }
}

const renderLeftNumber = (
  element: ColType,
  index: number,
  left: number = 0
) => {
  const rect = new fabric.Rect({
    width: defaultLeftNumberWidth,
    height: element.height,
    fill: defaultTopNumberFill,
    // 边框的颜色和宽度
    strokeWidth: 0,
    stroke: defaultCellBorderColor,
    selectable: false,
  });
  const text = new fabric.Text(index + 1 + "", {
    fontSize: defaultFontSize,
    fontFamily: defaultFontFamily,
    fill: defaultCellFontColor,
  });
  const group = new fabric.Group([rect, text], {
    left: 0,
    top: element.y,
    selectable: false,
    evented: false,
  });
  group.item(1).set({
    originX: "center",
    originY: "center",
    left: 0,
    top: 0,
  });
  group.set({
    left,
  });
  return group;
};

export class DrawLeftNumber {
  public canvas: fabric.Canvas;
  public options: optionsType;
  private groups: fabric.Group[] = [];
  private tmpGroups: fabric.Group[] = [];
  private tmpCols: ColType[] = [];

  constructor(canvas: fabric.Canvas, options: optionsType) {
    this.canvas = canvas;
    this.options = options;
    this.groups = [];
    this.tmpGroups = [];
    this.tmpCols = [];
    this.renderGroups();
  }

  // 渲染侧边的1-2-3...
  renderGroups() {
    // 先移除所有的，再重新渲染
    if (this.groups) {
      this.groups.forEach((item) => {
        this.canvas.remove(item);
      });
      this.groups = [];
    }
    const { tl } = calcViewport(this.canvas);
    for (let i = 0; i < this.options.cols.length; i++) {
      const element = this.options.cols[i];
      const group = renderLeftNumber(element, i, tl.x);
      this.groups.push(group);
      this.canvas.add(group);
      this.canvas.bringToFront(group);
    }
  }

  // 新增真实的数据
  addGroups(cols: ColType[]) {
    this.options.cols = [...this.options.cols, ...cols];
    this.renderGroups();
  }

  // 将所有的都移动在canvas的left为零的位置
  setLeftZero() {
    this.renderGroups();
    this.addTemp(this.tmpCols);
  }

  // 新增临时的部分
  addTemp(cols: ColType[]) {
    this.tmpCols = cols;
    // 清楚临时的部分
    this.tmpGroups.forEach((group) => {
      this.canvas.remove(group);
    });
    this.tmpGroups = [];
    let { tl } = calcViewport(this.canvas);
    // 渲染顶部的A-Z...
    for (let j = 0; j < cols.length; j++) {
      const element = cols[j];
      const group = renderLeftNumber(element, j, tl.x);
      this.tmpGroups.push(group);
      this.canvas.add(group);
      this.canvas.bringToFront(group);
    }
  }
}

export class DrawTopLeft {
  private canvas: fabric.Canvas;
  private group: fabric.Group | null = null;
  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
    this.render();
  }
  render() {
    if (this.group) {
      this.canvas.remove(this.group);
    }
    let { tl } = calcViewport(this.canvas);
    // 重新渲染
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
    // 渲染一条线
    const line = new fabric.Line(
      [
        defaultLeftNumberWidth,
        0,
        defaultLeftNumberWidth,
        defaultTopNumberHeight,
      ],
      {
        stroke: defaultCellBorderColor,
        strokeWidth: 1,
        selectable: false,
      }
    );
    const line1 = new fabric.Line(
      [
        0,
        defaultTopNumberHeight,
        defaultLeftNumberWidth,
        defaultTopNumberHeight,
      ],
      {
        stroke: defaultCellBorderColor,
        strokeWidth: 1,
        selectable: false,
      }
    );
    this.group = new fabric.Group([rect, line, line1], {
      left: tl.x,
      top: tl.y,
      selectable: false,
      evented: false,
    });
    this.canvas.add(this.group);
    this.canvas.bringToFront(this.group);
  }
  setZero() {
    this.render();
  }
}
