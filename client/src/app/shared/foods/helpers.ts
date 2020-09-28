export function exportText(filename: string, data: string) {
  var blob = new Blob([data], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.download = filename;
  a.rel = "noopener";
  a.href = URL.createObjectURL(blob);
  a.click();
  URL.revokeObjectURL(a.href);
};
