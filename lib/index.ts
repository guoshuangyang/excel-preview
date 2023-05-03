import {
  defaultCellBorderWidth,
  defaultLeftNumberWidth,
  defaultTopNumberHeight,
} from "~/utils/constant";
import { useExcel } from "~/utils/render";
import type { Container, ExcelData } from "~/@types/index";

export const renderExcel = (container: Container, object: ExcelData) => {
  let baseX = defaultCellBorderWidth + defaultLeftNumberWidth;
  let baseY = defaultTopNumberHeight + defaultCellBorderWidth;
  let { rows, cols } = object;
  for (let i = 0; i < rows.length; i++) {
    rows[i].x = baseX;
    baseX += rows[i].width + defaultCellBorderWidth;
  }
  for (let i = 0; i < cols.length; i++) {
    cols[i].y = baseY;
    baseY += cols[i].height + defaultCellBorderWidth;
  }
  useExcel(container, {
    rows,
    cols,
  });
};
