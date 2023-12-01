import fs from "fs";
function wait(t) {
  return new Promise((e) => {
    setTimeout(e, t);
  });
}
function readFileAsync(a) {
  return new Promise((e, t) => {
    try {
      e(fs.readFileSync(a, "utf8"));
    } catch (e) {
      t(e);
    }
  });
}
function writeFileAsync(a, n, i) {
  return new Promise((e, t) => {
    try {
      fs.writeFileSync(a, n, { flag: i }), e();
    } catch (e) {
      t(e);
    }
  });
}
async function evaluate(e, t, a, n) {
  return n
    ? await e.evaluate(
        async (e, t, a) => {
          e = await fetch(e, {
            method: "POST",
            headers: t,
            credentials: "include",
            body: JSON.stringify(a),
          });
          return e.ok ? await e.json() : null;
        },
        t,
        a,
        n
      )
    : await e.evaluate(
        async (e, t) => {
          e = await fetch(e, { headers: t, credentials: "include" });
          return e.ok ? await e.json() : null;
        },
        t,
        a
      );
}
export { wait, readFileAsync, writeFileAsync, evaluate };
