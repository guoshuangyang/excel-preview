import {
  defaultBorderWidth,
  defaultLeftNumberWidth,
  defaultTopNumberHeight,
} from "~/utils/constant";
import { useExcel } from "~/utils/render";
import type { Container, ExcelData } from "~/@types/index";

export const renderExcel = (container: Container, object: ExcelData) => {
  let baseX = defaultBorderWidth + defaultLeftNumberWidth;
  let baseY = defaultBorderWidth + defaultTopNumberHeight;
  let { rows, cols } = object;
  for (let i = 0; i < rows.length; i++) {
    rows[i].x = baseX;
    baseX += rows[i].width + defaultBorderWidth;
  }
  for (let i = 0; i < cols.length; i++) {
    cols[i].y = baseY;
    baseY += cols[i].height + defaultBorderWidth;
  }
  useExcel(container, {
    rows,
    cols,
  });
};
