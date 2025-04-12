export const evaluateFormula = (formula, grid) => {
  try {
    const match = formula.match(/=(SUM|AVERAGE)\(([^)]+)\)/i);
    if (!match) return "";

    const [, func, range] = match;
    const [start, end] = range.split(":");

    const getIndices = (cell) => {
      const col = cell.charCodeAt(0) - 65;
      const row = parseInt(cell.slice(1)) - 1;
      return [row, col];
    };

    const [startRow, startCol] = getIndices(start);
    const [endRow, endCol] = getIndices(end);

    let values = [];

    for (let i = startRow; i <= endRow; i++) {
      for (let j = startCol; j <= endCol; j++) {
        const val = grid[i]?.[j]?.value;
        const num = parseFloat(val);
        if (!isNaN(num)) values.push(num);
      }
    }

    if (func === "SUM") return values.reduce((a, b) => a + b, 0);
    if (func === "AVERAGE")
      return values.reduce((a, b) => a + b, 0) / values.length;

    return "";
  } catch {
    return "ERR";
  }
};
