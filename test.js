const fs = require("fs");

async function main() {
  const file = await fs.promises.readFile(
    "C:\\Users\\johan\\Downloads\\repomix-output.txt"
  );

  const r = await fetch("http://127.0.0.1:11434/api/generate", {
    method: "POST",
    // headers: {
    //     'Content-Type': 'application/json',
    // },
    body: JSON.stringify({
      model: "llama3.2",
      prompt:
        `The following file contains all the files in the repository combined into one.
` +
        file +
        `
================================================================
================================================================
================================================================
================================================================

There is a bug in here somewhere, please find it!
`,
    }),
  });
  //   const r = await fetch("http://127.0.0.1:11434/api/generate");

  const lines = (await r.text()).split("\n");
  console.log(lines);

  let text = "";
  for (const line of lines) {
    try {
      const j = JSON.parse(line);

      text += j.response + "";
    } catch (e) {
      console.error(e);
    }
  }

  //   text = text.replace(/\  /g, " ").replace(/\  /g, " ");

  console.log(text);
}

main().catch(console.error);
