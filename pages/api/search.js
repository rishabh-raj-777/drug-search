export default async function handler(req, res) {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: "Drug name is required" });
  }

  try {
    // Step 1: Search KEGG for the drug
    const findResponse = await fetch(`https://rest.kegg.jp/find/drug/${name}`);
    const findText = await findResponse.text();

    const firstLine = findText.split('\n')[0];
    if (!firstLine) {
      return res.status(404).json({ error: "Drug not found" });
    }

    const entryId = firstLine.split('\t')[0];

    // Step 2: Get detailed info
    const getResponse = await fetch(`https://rest.kegg.jp/get/${entryId}`);
    const rawDetails = await getResponse.text();

    // Step 3: Parse key fields
    const lines = rawDetails.split('\n');
    const data = {};
    let currentKey = "";

    for (const line of lines) {
      const key = line.substring(0, 12).trim();
      const value = line.substring(12).trim();

      if (key) {
        currentKey = key;
        data[key] = value;
      } else if (currentKey) {
        data[currentKey] += " " + value;
      }
    }

    const parsedResult = {
      entry: data["ENTRY"],
      name: data["NAME"],
      formula: data["FORMULA"],
      description: data["REMARK"] || data["COMMENT"] || "No description",
      raw: rawDetails,
    };

    return res.status(200).json(parsedResult);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch drug data" });
  }
}
