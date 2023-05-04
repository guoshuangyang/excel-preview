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
  defaultThemeColor,
  defaultActiveBackgroundColor,
} from "~/utils/constant";
import { generateRowIndex } from "~/utils/generate/string";
import { calcViewport } from "../calc";

const renderTopNumber = (element: RowType, index: number, top: number = 0) => {
  const rect = new fabric.Rect({
    width: element.width,
    height: defaultTopNumberHeight,
    fill: element.headerColor || defaultTopNumberFill,
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
  });
  let group = new fabric.Group([rect, text], {
    left: element.x,
    top: top,
    selectable: false,
    evented: false,
  });
  if (element.headerColor && element.headerColor !== defaultTopNumberFill) {
    // 新增一条线
    const line = new fabric.Line(
      [
        element.x,
        defaultTopNumberHeight + top,
        element.x + element.width,
        defaultTopNumberHeight + top,
      ],
      {
        stroke: defaultThemeColor,
        strokeWidth: 2,
        selectable: false,
        evented: false,
        originX: "center",
        originY: "center",
      }
    );
    group.addWithUpdate(line);
  }
  group.bringToFront();
  return group;
};

const renderLeftNumber = (
  element: ColType,
  index: number,
  left: number = 0
) => {
  const rect = new fabric.Rect({
    width: defaultLeftNumberWidth,
    height: element.height,
    fill: element.headerColor || defaultTopNumberFill,
    // 边框的颜色和宽度
    strokeWidth: 0,
    stroke: defaultCellBorderColor,
    selectable: false,
    originX: "center",
    originY: "center",
    top: 0,
    left: 0,
  });
  const text = new fabric.Text(index + 1 + "", {
    fontSize: defaultFontSize,
    fontFamily: defaultFontFamily,
    fill: defaultCellFontColor,
    originX: "center",
    originY: "center",
  });
  const group = new fabric.Group([rect, text], {
    top: element.y,
    selectable: false,
    evented: false,
    left: left,
  });
  if (element.headerColor && element.headerColor !== defaultTopNumberFill) {
    // 新增一条线
    const line = new fabric.Line(
      [
        defaultLeftNumberWidth + left,
        element.y,
        defaultLeftNumberWidth + left,
        element.y + element.height,
      ],
      {
        stroke: defaultThemeColor,
        strokeWidth: 2,
        selectable: false,
        evented: false,
      }
    );
    group.addWithUpdate(line);
  }
  return group;
};

export class DrawTopMenu {
  public canvas: fabric.Canvas;
  public options: optionsType;
  private groups: fabric.Group[] = [];
  private activeRowIndexStart: number = -1;
  private activeRowIndexEnd: number = -1;

  constructor(canvas: fabric.Canvas, options: optionsType) {
    this.canvas = canvas;
    this.options = options;
    this.groups = [];
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
  }

  setActiveRowIndex(start: number, end?: number) {
    if (!end) {
      end = start;
    }
    if (this.activeRowIndexStart !== -1 || this.activeRowIndexEnd !== -1) {
      for (let i = this.activeRowIndexStart; i <= this.activeRowIndexEnd; i++) {
        console.log("object");
        delete this.options.rows[i].headerColor;
      }
    }
    this.activeRowIndexStart = start;
    this.activeRowIndexEnd = end;
    for (let i = start; i <= end; i++) {
      this.options.rows[i].headerColor = defaultActiveBackgroundColor;
    }
    this.renderGroups();
  }
}

export class DrawLeftNumber {
  public canvas: fabric.Canvas;
  public options: optionsType;
  private groups: fabric.Group[] = [];
  private activeColIndexStart: number = -1;
  private activeColIndexEnd: number = -1;

  constructor(canvas: fabric.Canvas, options: optionsType) {
    this.canvas = canvas;
    this.options = options;
    this.groups = [];
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

  setActiveColIndex(start: number, end?: number) {
    if (!end) {
      end = start;
    }
    if (this.activeColIndexStart !== -1 || this.activeColIndexEnd !== -1) {
      for (let i = this.activeColIndexStart; i <= this.activeColIndexEnd; i++) {
        delete this.options.cols[i].headerColor;
      }
    }
    this.activeColIndexStart = start;
    this.activeColIndexEnd = end;
    for (let i = this.activeColIndexStart; i <= this.activeColIndexEnd; i++) {
      this.options.cols[i].headerColor = defaultActiveBackgroundColor;
    }
    this.renderGroups();
  }

  // 新增真实的数据
  addGroups(cols: ColType[]) {
    this.options.cols = [...this.options.cols, ...cols];
    this.renderGroups();
  }

  // 将所有的都移动在canvas的left为零的位置
  setLeftZero() {
    this.renderGroups();
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
