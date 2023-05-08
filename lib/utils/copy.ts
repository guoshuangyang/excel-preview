// let pasteHandler = async () => {
//   const clipboardItems = await window.navigator.clipboard.read();
//   let textHtml, textPlain;
//   for (const clipboardItem of clipboardItems) {
//     for (const type of clipboardItem.types) {
//       const item = await clipboardItem.getType(type);
//       if (item && item.type == "text/html") {
//         textHtml = await item.text();
//       }
//       if (item && item.type == "text/plain") {
//         textPlain = await item.text();
//       }
//     }
//   }
//   return { textHtml, textPlain };
// };

export {};
