import React from "react";
import jsPDF from "jspdf";

const Report = (props) => {
  const { tareas, progreso, buttonStyle } = props;
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Reporte de Tareas", 14, 16);
    doc.setFontSize(12);
    doc.text(`Progreso total: ${progreso}%`, 14, 28);
    doc.setFontSize(10);
    doc.text("Nota: El campo 'Tiempo' equivale a días estimados (0.5 = medio día, 1 = un día)", 14, 34);
    doc.setFontSize(12);
    doc.text("Tareas:", 14, 44);
    let y = 48;
    // Cabecera de tabla
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('#', 14, y);
    doc.text('Nombre', 24, y);
    doc.text('Est.', 110, y);
    doc.text('Pts.', 132, y);
    doc.setFont(undefined, 'normal');
    y += 6;
    let totalPuntos = 0;
    tareas.forEach((t, i) => {
      doc.text(`${i + 1}`, 14, y);
      doc.text(t.nombre.length > 40 ? t.nombre.slice(0, 37) + '...' : t.nombre, 24, y, { maxWidth: 80 });
      const estadoAbrev = t.estado === 'pendiente' ? 'P' : t.estado === 'en ejecución' ? 'E' : 'C';
      doc.text(estadoAbrev, 110, y, { align: 'left' });
      doc.text(t.puntos.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 2 }), 132, y, { align: 'left' });
      totalPuntos += Number(t.puntos);
      y += 9;
      if (y > 270) {
        doc.addPage();
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('#', 14, 20);
        doc.text('Nombre', 24, 20);
        doc.text('Est.', 110, 20);
        doc.text('Pts.', 132, 20);
        doc.setFont(undefined, 'normal');
        y = 26;
      }
    });
    // Total de puntos
    doc.setFont(undefined, 'bold');
    doc.text('Total puntos:', 90, y + 4);
    doc.text(totalPuntos.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 2 }), 132, y + 4, { align: 'left' });
    doc.setFont(undefined, 'normal');
    // Leyenda
    y += 14;
    doc.setFontSize(9);
    doc.text('Est.: P = Pendiente, E = En ejecución, C = Completada', 14, y);
    doc.text('Pts.: Tiempo estimado en días (0.5 = medio día, 1 = un día)', 14, y + 7);
    doc.save("reporte_tareas.pdf");
  };

  return (
    <button
      onClick={exportPDF}
      style={{
        background: 'linear-gradient(90deg, #2563eb 0%, #22c55e 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: 12,
        padding: '14px 36px',
        fontWeight: 800,
        fontSize: 18,
        boxShadow: '0 4px 20px #2563eb33',
        cursor: 'pointer',
        transition: 'background .18s, transform .12s',
        letterSpacing: 1,
        outline: 'none',
        margin: '0 0 18px 0',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        ...buttonStyle,
      }}
      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6zm0 2h12v16H6V4zm5 2v8h2V6h-2zm-2 10v2h6v-2H9z"/></svg>
      Exportar a PDF
    </button>
  );
};

export default Report;
