export const dispalyValueinCell = (cell, grid) => {
  if (typeof cell.value === "string" && cell.value.startsWith("=")) {
    return calculateTheValuByFormula(cell.value, grid);
  }
  return cell.value;
};

export const calculateTheValuByFormula = (formula, grid) => {
  try {
    if (formula.startsWith("=SUM(") || formula.startsWith("=AVG(")) {
      const isSum = formula.startsWith("=SUM(");
      const selectedCells = formula.slice(5, -1);
      const [start, end] = selectedCells.split(":");
      console.log("end", selectedCells);

      const [startRow, startCol] = start;
      const [endRow, endCol] = end;

      let total = 0;
      let count = 0;

      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          const cellVal = grid[r][c].value;
          const num = parseFloat(cellVal);
          if (isNaN(num)) {
            total += num;
            count++;
          }
        }
      }
      return isSum ? total : count > 0 ? (total / count).toFixed(2) : 0;
    }
  } catch (error) {
    console.log("error", error);
    return "ERROR";
  }
  return formula;
};
