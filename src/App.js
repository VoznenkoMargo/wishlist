import React, { useState, useEffect } from 'react';
import { v4 } from 'uuid';
import { randomColor } from 'randomcolor';
import Draggable from 'react-draggable';
import './App.scss';

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function App() {
  const [inputValue, setInputValue] = useState('');
  const [edit, setEdit] = useState(null);
  const [editInput, setEditInput] = useState('');
  const [items, setItems] = useState(
    JSON.parse(localStorage.getItem('items')) || []
  );
  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  const newItem = () => {
    if (inputValue.trim() !== '') {
      const newItem = {
        id: v4(),
        item: inputValue,
        color: randomColor({
          luminosity: 'light',
        }),
        defaultPos: {
          x: -300 + random(-100, 100),
          y: -100 + random(-100, 100),
        },
      };
      setItems((items) => [...items, newItem]);
      setInputValue('');
    } else {
      alert('Enter something...');
      setInputValue('');
    }
  };

  const deleteItem = (id) => {
    let newArr = [...items];
    setItems(newArr.filter((item) => item.id !== id));
  };

  const updatePos = (data, index) => {
    let newArray = [...items];
    newArray[index].defaultPos = { x: data.x, y: data.y };
    setItems(newArray);
  };

  const keyPress = (e) => {
    if (e.key === 'Enter') {
      newItem();
    }
  };
  const keyPressEdit = (e, id) => {
    if (e.key === 'Enter') {
      saveUpdatedTodo(id);
    }
  };

  const updateItem = (id, title) => {
    setEdit(id);
    setEditInput(title);
  };

  const saveUpdatedTodo = (id) => {
    let newItem = [...items].map((item) => {
      if (item.id === id) {
        if (editInput.trim().length > 2) {
          item.item = editInput;
        } else {
          alert('your text length must more than 2 sybmols');
        }
      }
      return item;
    });
    setItems(newItem);
    setEdit(null);
  };

  return (
    <div className="App">
      <div className="wraper">
        <h1>Your wishlist</h1>
        <input
          value={inputValue}
          type="text"
          placeholder="Enter something..."
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => keyPress(e)}
        />
        <button className="enter" onClick={newItem}>
          ENTER
        </button>
      </div>

      {items.map((item, index) => {
        return (
          <Draggable
            key={index}
            defaultPosition={item.defaultPos}
            onStop={(_, data) => {
              updatePos(data, index);
            }}
          >
            <div className="todo__item" style={{ backgroundColor: item.color }}>
              {edit === item.id ? (
                <>
                  {' '}
                  <input
                    className="edit"
                    type="text"
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    onKeyDown={(e) => keyPressEdit(e, item.id)}
                    onTouchStart={(e) => setEditInput(e.target.value)}
                  />
                  <button
                    className="save"
                    onClick={() => saveUpdatedTodo(item.id)}
                    onTouchStart={() => saveUpdatedTodo(item.id)}
                  >
                    SAVE
                  </button>
                </>
              ) : (
                item.item
              )}
              {edit !== item.id && (
                <button
                  className="close-delete"
                  onClick={() => deleteItem(item.id)}
                  onTouchStart={() => deleteItem(item.id)}
                >
                  &#10006;
                </button>
              )}

              {edit !== item.id && (
                <button
                  className="update"
                  onClick={() => updateItem(item.id, item.item)}
                  onTouchStart={() => updateItem(item.id, item.item)}
                >
                  &#10000;
                </button>
              )}
            </div>
          </Draggable>
        );
      })}
    </div>
  );
}

export default App;
