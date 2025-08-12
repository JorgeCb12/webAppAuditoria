import React from "react";
import jsPDF from "jspdf";

const Report = ({ tareas, progreso }) => {
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Reporte de Tareas", 14, 16);
    doc.setFontSize(12);
    doc.text(`Progreso total: ${progreso}%`, 14, 28);
    doc.text("Tareas:", 14, 38);
    let y = 48;
    tareas.forEach((t, i) => {
      doc.text(
        `${i + 1}. ${t.nombre} | Estado: ${t.estado} | Puntos: ${t.puntos}`,
        14,
        y
      );
      y += 10;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save("reporte_tareas.pdf");
  };

  return (
    <button onClick={exportPDF} style={{ margin: "16px 0" }}>
      Exportar a PDF
    </button>
  );
};

export default Report;
