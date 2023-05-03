import Color from "color";
// 正则
export const httpsReg = /^https:\/\//;

// 大小和宽高
export const defaultSelectBorderWidth = 1.2; // 选中的边框宽度
export const defaultCellBorderWidth = 1; // 边框的宽度
export const defaultCellWidth = 80; // 默认单元格宽度
export const defaultCellHeight = 20; // 默认单元格高度
export const defaultFontSize = 11; // 默认字体大小
export const defaultSelectedRBWidth = 5; // 选中的右下角的宽度
// 侧边栏的宽度
export const defaultLeftNumberWidth = 40;
// 顶部数字栏目的高度
export const defaultTopNumberHeight = 20;
// 默认单元格字体
export const defaultFontFamily = "宋体";

// excel右下角可以离画布右下角多远
export const defaultExcelRightBottomDistance = 200;

// 主题-颜色-宽高
export const defaultThemeColor = "#22ba7c"; // 主题颜色

export const defaultCellBorderColor = "#d8dade"; // 边框颜色
export const defaultCellBackgroundColor = "#fff"; // 单元格背景颜色
export const defaultCellFontColor = "#000"; // 单元格字体颜色
export const defaultTopNumberFill = "#f1f3f6"; // 数字栏目的背景颜色
export const defaultActiveNumberColor = "#efefef"; // 选中的数字颜色
export const defaultActiveBackgroundColor = Color("#22ba7c")
  .alpha(0.2)
  .string();
