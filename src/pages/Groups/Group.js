import React, { useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { MdDeleteForever } from 'react-icons/md';
import { FaChevronDown } from 'react-icons/fa';
import { FaChevronUp } from 'react-icons/fa';

const Group = ({ group, handleUpdateGroup, handleDeleteGroup }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggleAccordion = (e) => {
    setIsOpen((prev) => !prev);
  };
  return (
    <div>
      <div
        style={{
          padding: '1rem',
          margin: '0.5rem',
          justifyContent: 'space-between',
          display: 'flex',
          boxShadow:
            'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
        }}
        className="group-row"
        onClick={handleToggleAccordion}
      >
        <div style={{ color: 'var(--kendo-color-primary)' }}>{group.name}</div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <MdDeleteForever
            className="group-action"
            onClick={() => handleDeleteGroup(group)}
          />
          <MdEdit
            className="group-action"
            onClick={() => handleUpdateGroup(group.id, group.name)}
          />
          {!isOpen && <FaChevronDown className="group-action" />}
          {isOpen && <FaChevronUp className="group-action" />}
        </div>
      </div>

      {isOpen && (
        <div
          style={{
            margin: '0.5rem',
            padding: '0.5rem',
            paddingLeft: '2rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ul
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              color: 'rgb(123, 123, 123)',
            }}
          >
            {group.accepted.map((user) => {
              return (
                <li>
                  {user?.firstName} {user?.lastName} ({user?.email})
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Group;
