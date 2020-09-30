export function delay(seconds: number) {
  return new Promise(res => {
    setTimeout(() => {
      res();
    }, seconds * 1_000);
  });
}

export function clientFetch() {
  fetch("http://localhost:8080/healthexport", {
    body: JSON.stringify({ x: "hi", y: 9 }),
    method: "POST",
    headers: [["content-type", "application/json"]]
  }).then(res => console.log(res));
}
