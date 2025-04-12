import React, { useState, useEffect } from "react";
import { evaluateFormula } from "../utils/formulaParser";

const getColumnLabel = (index) => String.fromCharCode(65 + index);

const Spreadsheet = () => {
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [grid, setGrid] = useState([]);
  const [copiedCell, setCopiedCell] = useState(null);

  useEffect(() => {
    const newGrid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({
        value: "",
        bold: false,
        bgColor: "",
      }))
    );
    setGrid(newGrid);
  }, [rows, cols]);

  const handleChange = (r, c, val) => {
    const newGrid = [...grid];
    newGrid[r][c].value = val;
    setGrid(newGrid);
  };

  const handleBlur = (r, c) => {
    const val = grid[r][c].value;
    if (val.startsWith("=")) {
      const evaluated = evaluateFormula(val, grid);
      const newGrid = [...grid];
      newGrid[r][c].value = evaluated;
      setGrid(newGrid);
    }
  };

  const addRow = () => setRows((prev) => prev + 1);
  const addCol = () => setCols((prev) => prev + 1);

  const toggleBold = (r, c) => {
    const newGrid = [...grid];
    newGrid[r][c].bold = !newGrid[r][c].bold;
    setGrid(newGrid);
  };

  const changeBgColor = (r, c, color) => {
    const newGrid = [...grid];
    newGrid[r][c].bgColor = color;
    setGrid(newGrid);
  };

  const copyCell = (r, c) => {
    setCopiedCell({ ...grid[r][c] });
  };

  const pasteCell = (r, c) => {
    if (copiedCell) {
      const newGrid = [...grid];
      newGrid[r][c] = { ...copiedCell };
      setGrid(newGrid);
    }
  };

  const saveJSON = () => {
    const data = JSON.stringify(grid);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spreadsheet.json";
    a.click();
  };

  const loadJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const loaded = JSON.parse(e.target.result);
      setRows(loaded.length);
      setCols(loaded[0].length);
      setGrid(loaded);
    };
    reader.readAsText(file);
  };

  return (
    <div>
      {/* <h2>Spreadsheet</h2> */}
      <button onClick={addRow} className="addRow">
        Add Row
      </button>
      <button onClick={addCol} className="addCol">
        Add Column
      </button>
      <button onClick={saveJSON} className="save">
        Save
      </button>
      <input type="file" accept="application/json" onChange={loadJSON} />

      <table border="1" className="tableContainer">
        <thead>
          <tr>
            <th></th>
            {Array.from({ length: cols }, (_, c) => (
              <th key={c} className="header">
                {getColumnLabel(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, r) => (
            <tr key={r}>
              <th className="header">{r + 1}</th>
              {Array.from({ length: cols }, (_, c) => (
                <td
                  key={c}
                  style={{
                    background: grid[r]?.[c]?.bgColor || "white",
                    fontWeight: grid[r]?.[c]?.bold ? "bold" : "normal",
                  }}
                  onDoubleClick={() => toggleBold(r, c)}
                  onClick={() => copyCell(r, c)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    pasteCell(r, c);
                  }}
                >
                  <div className="cell-box">
                    <input
                      type="text"
                      value={grid[r]?.[c]?.value || ""}
                      onChange={(e) => handleChange(r, c, e.target.value)}
                      onBlur={() => handleBlur(r, c)}
                      style={{
                        background: grid[r]?.[c]?.bgColor || "white",
                        fontWeight: grid[r]?.[c]?.bold ? "bold" : "normal",
                      }}
                    />
                    <input
                      type="color"
                      onChange={(e) => changeBgColor(r, c, e.target.value)}
                      className="colorPicker"
                    />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Spreadsheet;
