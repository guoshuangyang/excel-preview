// 判断可不可以读取已经安装的字体 Chrome103 以后的版本才支持的
export const getFonts = async () => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    navigator.permissions.query({ name: "local-fonts" }).then((result) => {
      if (result.state === "granted") {
        const arr = queryLocalFonts();
        resolve(arr);
      } else if (result.state === "prompt") {
        if (queryLocalFonts) {
          const arr = queryLocalFonts();
          resolve(arr);
        }
      } else if (result.state === "denied") {
        reject({
          message: "已经拒绝",
        });
      }
      result.onchange = () => {};
    });
  });
};
