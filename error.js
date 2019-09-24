class FancyError extends Error {
  constructor(args) {
    super(args);
    this.name = "FancyError";
  }
}

console.log(new FancyError("Error here mannn!!"));
