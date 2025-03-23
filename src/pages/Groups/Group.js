import React, { useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { MdDeleteForever } from 'react-icons/md';
import { FaChevronDown } from 'react-icons/fa';
import { FaChevronUp } from 'react-icons/fa';

const Group = ({ group, handleUpdateGroup }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggleAccordion = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <div>
      <div
        style={{
          padding: '1rem',
          margin: '0.5rem',
          width: '20rem',
          justifyContent: 'space-between',
          display: 'flex',
          boxShadow:
            'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
        }}
      >
        <div>{group.name}</div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <MdDeleteForever style={{ color: '#4D55CC', cursor: 'pointer' }} />
          <MdEdit
            style={{ color: '#4D55CC', cursor: 'pointer' }}
            onClick={() => handleUpdateGroup(group.id, group.name)}
          />
          {!isOpen && (
            <FaChevronDown
              style={{ color: '#4D55CC', cursor: 'pointer' }}
              onClick={handleToggleAccordion}
            />
          )}
          {isOpen && (
            <FaChevronUp
              style={{ color: '#4D55CC', cursor: 'pointer' }}
              onClick={handleToggleAccordion}
            />
          )}
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              color: 'rgb(123, 123, 123)',
            }}
          >
            {group.accepted.map((user) => {
              return (
                <div>
                  {user?.firstName} {user?.lastName} {user?.email}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Group;
