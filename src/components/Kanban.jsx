import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const mockTareas = [
  { id: "1", nombre: "Diseñar wireframes" },
  { id: "2", nombre: "Configurar repositorio" },
  { id: "3", nombre: "Desarrollar login" },
  { id: "4", nombre: "Crear base de datos" },
  { id: "5", nombre: "Tests unitarios" },
];

const columnasIniciales = {
  "por-hacer": {
    nombre: "Por hacer",
    items: mockTareas,
  },
  "en-ejecucion": {
    nombre: "En ejecución",
    items: [],
  },
  terminado: {
    nombre: "Terminado",
    items: [],
  },
};

const Kanban = () => {
  const [columnas, setColumnas] = useState(columnasIniciales);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    const sourceCol = columnas[source.droppableId];
    const destCol = columnas[destination.droppableId];
    const sourceItems = Array.from(sourceCol.items);
    const [removed] = sourceItems.splice(source.index, 1);
    if (sourceCol === destCol) {
      sourceItems.splice(destination.index, 0, removed);
      setColumnas({
        ...columnas,
        [source.droppableId]: { ...sourceCol, items: sourceItems },
      });
    } else {
      const destItems = Array.from(destCol.items);
      destItems.splice(destination.index, 0, removed);
      setColumnas({
        ...columnas,
        [source.droppableId]: { ...sourceCol, items: sourceItems },
        [destination.droppableId]: { ...destCol, items: destItems },
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 40 }}>
        {Object.entries(columnas).map(([colId, col]) => (
          <Droppable droppableId={colId} key={colId}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  background: snapshot.isDraggingOver ? "#f0f9ff" : "#f3f4f6",
                  padding: 16,
                  width: 250,
                  minHeight: 400,
                  borderRadius: 8,
                  boxShadow: "0 2px 8px #0001",
                  transition: "background .2s",
                }}
              >
                <h3 style={{ textAlign: "center" }}>{col.nombre}</h3>
                {col.items.map((item, idx) => (
                  <Draggable draggableId={item.id} index={idx} key={item.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          userSelect: "none",
                          padding: 12,
                          margin: "0 0 12px 0",
                          minHeight: "50px",
                          background: snapshot.isDragging ? "#bae6fd" : "#fff",
                          color: "#222",
                          borderRadius: 6,
                          boxShadow: "0 1px 4px #0001",
                          ...provided.draggableProps.style,
                        }}
                      >
                        {item.nombre}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Kanban;
