import { fabric } from "fabric";
import { renderExcel } from "~/utils/render/draw";
import type { CallbackArgsType, eventNameType } from "~/@types/event/index";
import bindAllEvents from "~/utils/events/index";
import publicSubscribe from "~/utils/events/publicSubscribe";
import {
  defaultActiveBackgroundColor,
  defaultCellBackgroundColor,
  defaultCellBorderWidth,
  defaultLeftNumberWidth,
  defaultSelectBorderWidth,
  defaultSelectedRBWidth,
  defaultThemeColor,
  defaultTopNumberHeight,
} from "~/utils/constant";
import { throttle } from "lodash-es";
import { Container, ExcelData } from "~/@types";

export const useExcel = (id: Container, options: ExcelData) => {
  let canvas: fabric.Canvas;
  let canvasBox: HTMLElement;
  if (id && typeof id === "string") {
    canvasBox = document.getElementById(id) as HTMLElement;
  } else {
    canvasBox = id as HTMLElement;
  }
  if (!canvasBox) {
    throw new Error("el is not found");
  }
  const { offsetWidth, offsetHeight } = canvasBox;
  // 创建一个canvas
  let paper = document.createDocumentFragment();
  let canvasDom = document.createElement("canvas");
  canvasDom.setAttribute("id", "canvas");
  paper.appendChild(canvasDom);
  canvasBox.appendChild(paper);
  canvas = new fabric.Canvas(canvasDom, {
    selection: false,
    width: offsetWidth,
    height: offsetHeight,
    backgroundColor: "white",
    // 允许手势放大
    allowTouchScrolling: true,
  });
  const rowAndCol = {
    rows: options.rows,
    cols: options.cols,
  };
  const { topNumber, leftNumber, leftTopNumber } = renderExcel(
    canvas,
    rowAndCol
  );
  bindAllEvents(canvas, rowAndCol);
  let selectBorder: fabric.Group;
  publicSubscribe.on("mouseDown", (args) => {
    const pointer = args.event.pointer;
    if (!pointer) return;

    const { row, col } = args;
    if (row < 0 || col < 0) {
      // 点击的是行头或者列头
      // console.log(row, col);
      return;
    }
    topNumber.setActiveRowIndex(row);
    leftNumber.setActiveColIndex(col);
    let tlX = options.rows[row].x;
    let tlY = options.cols[col].y;
    let brX =
      options.rows[row].x + options.rows[row].width + defaultCellBorderWidth;
    let brY =
      options.cols[col].y + options.cols[col].height + defaultCellBorderWidth;
    const renderFn = () => {
      // 2. 绘制选中框 矩形
      let rect = new fabric.Rect({
        left: tlX,
        top: tlY,
        width: brX - tlX,
        height: brY - tlY,
        fill: defaultCellBackgroundColor,
        stroke: defaultThemeColor,
        strokeWidth: defaultSelectBorderWidth,
        selectable: false,
        evented: false,
      });
      // let tl = new fabric.Line([tlX, tlY, brX, tlY], {
      //   stroke: defaultThemeColor,
      //   strokeWidth: defaultSelectBorderWidth,
      // });
      // let tr = new fabric.Line([tlX, tlY, tlX, brY], {
      //   stroke: defaultThemeColor,
      //   strokeWidth: defaultSelectBorderWidth,
      // });
      // let bl = new fabric.Line([tlX, brY, brX, brY], {
      //   stroke: defaultThemeColor,
      //   strokeWidth: defaultSelectBorderWidth,
      // });
      // let br = new fabric.Line([brX, tlY, brX, brY], {
      //   stroke: defaultThemeColor,
      //   strokeWidth: defaultSelectBorderWidth,
      // });
      let btn = new fabric.Rect({
        left: brX - defaultSelectedRBWidth / 2,
        top: brY - defaultSelectedRBWidth / 2,
        width: defaultSelectedRBWidth,
        height: defaultSelectedRBWidth,
        fill: defaultThemeColor,
        strokeWidth: 0,
        selectable: false,
        evented: false,
      });
      // 绘制成一个组
      selectBorder = new fabric.Group([rect, btn], {
        selectable: false,
        // 不能被移动
        evented: false,
      });
      canvas.add(selectBorder);
      canvas.bringToFront(selectBorder);
    };
    if (selectBorder) {
      canvas.remove(selectBorder);
    }
    renderFn();
    canvas.renderAll();
  });
  const throttleDrawNumber = throttle(() => {
    // 禁止渲染
    topNumber.setTopZero();
    leftNumber.setLeftZero();
    leftTopNumber.setZero();
    // 重新渲染
    canvas.renderAll();
  }, 16);
  publicSubscribe.on("mouseWheel", (params) => {
    // @ts-ignore
    let { deltaX, deltaY } = (params.event as fabric.IEvent).e;
    const vpt = canvas.viewportTransform;
    // 如果左上角滑到画布的左上角, 则不再向右和向下滑动
    if (!(vpt instanceof Array && vpt.length > 4)) return;
    if (vpt[4] === 0 && vpt[5] === 0 && deltaX < 0 && deltaY < 0) return;
    vpt[4] = vpt[4] - deltaX < 0 ? vpt[4] - deltaX : 0;
    vpt[5] = vpt[5] - deltaY < 0 ? vpt[5] - deltaY : 0;
    throttleDrawNumber();
  });
  publicSubscribe.on("mouseOver", (params) => {
    // 判断鼠标是不是在菜单上
    if (params.col < 0) {
      // 鼠标在行头或者列头
      // 鼠标样式修改为下箭头
      canvas.defaultCursor = "s-resize";
      return;
    } else if (params.row < 0) {
      // 鼠标在行头或者列头
      // 鼠标样式修改为右箭头
      canvas.defaultCursor = "e-resize";
      return;
    } else {
      // 鼠标在表格中
      // console.log("在表格中");
      // 设置成默认的十字空心
      canvas.defaultCursor = "cell";
    }
  });

  // 暴露出来一下方法
  return {
    subscribe: (
      eventName: eventNameType,
      callback: (args: CallbackArgsType) => void
    ) => {
      // 订阅事件
      publicSubscribe.on(eventName, callback);
    },
    unsubscribe: (
      eventName: eventNameType,
      callback: (args: CallbackArgsType) => void
    ) => {
      // 取消订阅事件
      publicSubscribe.off(eventName, callback);
    },
  };
};
