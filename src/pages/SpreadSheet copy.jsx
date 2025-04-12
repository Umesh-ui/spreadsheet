import React from "react";
import { dispalyValueinCell } from "../utils/calculation";

const SpreadSheet = ({ grid, setGrid, editing, setEditing }) => {
  console.log("grid", grid);

  const handleCellValue = (row, column, value) => {
    console.log(row, column, value);
    const updated = [...grid];

    updated[row][column] = {
      ...updated[row][column],
      value,
    };
    setGrid(updated);

    // if (typeof value === "string" && value.startsWith("=")) {
    //   alert("Operation");
    // }
  };

  //   const viewCalculation = (cell) => {
  //     if (typeof cell.value === "string" && cell.value.startsWith("=")) {
  //       //   calculateFormula(cell.value)
  //       alert("formula addded");
  //     }
  //   };

  return (
    <table className="tableContainer">
      <tbody>
        {grid?.map((rowItem, rowIndex) => (
          <tr key={rowIndex}>
            {rowItem.map((cell, colIndex) => {
              return (
                <td key={colIndex}>
                  <input
                    value={
                      editing.row === rowIndex && editing.column === colIndex
                        ? cell.value
                        : dispalyValueinCell(cell, grid)
                    }
                    onChange={(e) =>
                      handleCellValue(rowIndex, colIndex, e.target.value)
                    }
                    style={{ width: 80, height: 25 }}
                  />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SpreadSheet;
