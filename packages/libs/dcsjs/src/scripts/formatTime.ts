const timeInput = process.argv[2];

const time = Number(timeInput);

if (isNaN(time)) {
  throw new Error("Invalid time");
}

const date = new Date(time * 1000);

// eslint-disable-next-line no-console
console.log(date.toISOString());
