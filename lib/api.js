export async function searchDrugByName(name) {
  const res = await fetch(`https://rest.kegg.jp/find/drug/${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error('Failed to fetch drug data');
  const text = await res.text();

  return text.trim().split('\n').map(line => {
    const [entry, desc] = line.split('\t');
    return { entry, description: desc };
  });
}
