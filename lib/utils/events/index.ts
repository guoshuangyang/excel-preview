import { throttle } from "lodash-es";
import type { optionsType } from "~/@types/data";
import { calcWhichCell } from "~/utils/calc";
import publicSubscribe from "~/utils/events/publicSubscribe";
// import { drawEmptyView } from "../render/drawView";

// 根据鼠标的位置计算出鼠标所在的单元格
const calcWhichCellByMousePosition = (
  event: fabric.IEvent,
  options: optionsType
) => {
  if (!event.absolutePointer) return null;
  let { row, col } = calcWhichCell(options, event.absolutePointer);
  return {
    row,
    col,
    event,
  };
};

// 对canvas的操作，都是通过fabric.Canvas的实例来操作的，所以我们需要先获取到fabric.Canvas的实例，然后再进行操作。
// 监听鼠标的移动事件 - 用于计算鼠标的位置 并做节流处理
const mouseOverEventCallback = throttle(
  (event: fabric.IEvent, options: optionsType) => {
    const params = calcWhichCellByMousePosition(event, options);
    params && publicSubscribe.emit("mouseOver", params);
  },
  16
);
// 监听鼠标的点击事件 - 用于计算鼠标的位置 并做节流处理
const mouseDownEventCallback = throttle(
  (event: fabric.IEvent, options: optionsType) => {
    const params = calcWhichCellByMousePosition(event, options);
    params && publicSubscribe.emit("mouseDown", params);
  },
  1000 / 21
);
// 监听鼠标的双击事件 - 用于计算鼠标的位置 并做节流处理
const mouseDblClickEventCallback = throttle(
  (event: fabric.IEvent, options: optionsType) => {
    const params = calcWhichCellByMousePosition(event, options);
    params && publicSubscribe.emit("mouseDblClick", params);
  },
  1000 / 21
);

// 鼠标滚轮事件
const mouseWheelEventCallback = (
  event: fabric.IEvent,
  options: optionsType
) => {
  const params = calcWhichCellByMousePosition(event, options);
  params && publicSubscribe.emit("mouseWheel", params);
};
export default function bindAllEvents(
  canvas: fabric.Canvas,
  options: optionsType
) {
  canvas.on("mouse:move", (event) => {
    mouseOverEventCallback(event, options);
  });
  canvas.on("mouse:down", (event) => {
    mouseDownEventCallback(event, options);
  });
  canvas.on("mouse:dblclick", (event) => {
    mouseDblClickEventCallback(event, options);
  });
  // 鼠标滚轮事件
  canvas.on("mouse:wheel", (event) => {
    event.e.preventDefault();
    event.e.stopPropagation();
    mouseWheelEventCallback(event, options);
  });
}
