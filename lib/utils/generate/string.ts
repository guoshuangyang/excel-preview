// 根据数字生成字符串，给0返回A给2返回B依次类推直至25返回Z，然后26-AA、27AB
export const generateRowIndex = (index: number): string => {
  const charCode = index + 65;
  if (charCode <= 90) {
    return String.fromCharCode(charCode);
  }
  return (
    generateRowIndex(Math.floor(index / 26) - 1) + generateRowIndex(index % 26)
  );
};
