export declare type eventNameType =
  | "mouseDblClick"
  | "mouseDown"
  | "mouseOver"
  | "mouseWheel"
  | "mouseUp";

export declare type CallbackArgsType = {
  row: number;
  col: number;
  event: fabric.IEvent;
};
