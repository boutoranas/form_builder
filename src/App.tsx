import React, { useState } from 'react';
import './App.css';
import { DragDropContext, Droppable, Draggable, DragStart } from 'react-beautiful-dnd';
import { FormQuestion, SidebarElement, TextConfig, DropdownConfig, TableConfig, FileConfig } from './types';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [sidebarElements, setSidebarElements] = useState<SidebarElement[]>([
    { type: 'text', label: 'Text Input' },
    { type: 'dropdown', label: 'Dropdown' },
    { type: 'table', label: 'Table' },
    { type: 'file', label: 'File upload' },
  ]);
  const [formLayout, setFormLayout] = useState<FormQuestion[]>([
    {
      id: '0',
      type: 'text',
      pos: 0,
      question: 'Sample Question',
      required: false,
      config: {} as TextConfig,
    },
  ]);
  const [nextId, setNextId] = useState(1);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const getDefaultConfig = (type: string): TextConfig | DropdownConfig | TableConfig | FileConfig => {
    switch (type) {
      case 'text':
        return { minLength: 0, maxLength: 100 };
      case 'dropdown':
        return { options: [], isMulti: false };
      case 'table':
        return { columns: [], rows: [] };
      case 'file':
        return { allowedTypes: [], maxSizeMB: 5 };
      default:
        return {};
    }
  };

  const onDragStart = (start: DragStart) => {
    const { source } = start;
    console.log(`source: ${source.index},`);
  };

  enum SidebarType {
    TEXT = 'text',
    DROPDOWN = 'dropdown',
    TABLE = 'table',
    FILE = 'file',
  };

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    // If dropped outside a droppable area, do nothing
    console.log(`source: ${source.droppableId}, destination: ${destination?.droppableId}, type: ${source.index}`);
    if (!destination) {
      return;
    }

    // Reordering within the form layout
    if (source.droppableId === 'form-layout' && destination.droppableId === 'form-layout') {
      const newFormLayout = Array.from(formLayout);
      const [reorderedItem] = newFormLayout.splice(source.index, 1);
      newFormLayout.splice(destination.index, 0, reorderedItem);
      const updatedFormLayout = newFormLayout.map((question, index) => ({
        ...question,
        pos: index,
      }));
      setFormLayout(updatedFormLayout);
    }
    // Adding a new question from the sidebar to the form layout
    
    else if (source.droppableId === 'sidebar' && destination.droppableId === 'form-layout') {
      const type = SidebarType[sidebarElements[source.index].type as keyof typeof SidebarType];
      const newId = String(nextId);
      setNextId(nextId + 1);
      const newQuestion: FormQuestion = {
        id: newId,
        type: type as 'text' | 'dropdown' | 'table' | 'file',
        pos: destination.index,
        question: `New ${type} Question`,
        required: false,
        config: getDefaultConfig(type),
      };
      const newFormLayout = Array.from(formLayout);
      newFormLayout.splice(destination.index, 0, newQuestion);
      const updatedFormLayout = newFormLayout.map((question, index) => ({
        ...question,
        pos: index,
      }));
      setFormLayout(updatedFormLayout);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Form Builder</h1>
      </header>
      <main className="App-main">
        <button className="toggle-button" onClick={toggleSidebar}>
          {isSidebarCollapsed ? '>' : '<'}
        </button>
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          <Sidebar isCollapsed={isSidebarCollapsed} elements={sidebarElements} />
          <div className="main-content">
          <Droppable droppableId="form-layout">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="sidebar-container"
            >
              
              {formLayout.map((element, index) => (
                <Draggable
                  key={element.id}
                  draggableId={`form-${element.id}`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="sidebar-item"
                    >
                      <span>{element.question}</span>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
          </div>
        </DragDropContext>
      </main>
    </div>
  );
}

const Sidebar = ({
  isCollapsed,
  elements,
}: {
  isCollapsed: boolean;
  elements: SidebarElement[];
}) => {
  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {!isCollapsed && (
        <Droppable droppableId="sidebar">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="sidebar-container"
            >
              <h3 className="sidebar-title">Form Elements</h3>
              {elements.map((element, index) => (
                <Draggable
                  key={element.type}
                  draggableId={`sidebar-${element.type}`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="sidebar-item"
                    >
                      <span>{element.label}</span>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
};

export default App;