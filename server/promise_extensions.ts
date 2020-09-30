interface Promise<T> {
  /** Runs in background and provides a default error handler */
  spawn(): void;
}

Promise.prototype.spawn = function () {
  this.catch(err => {
    console.error(`Unhandled Error:`);
    console.error(err);
  });
};
