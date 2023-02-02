import React, { useEffect, useState } from "react";
import "./App.css";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return JSON.parse(localStorage.getItem("list"));
  } else {
    return [];
  }
};

const App = () => {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditID] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    msg: "",
    type: "",
  });
  console.log(name);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name) {
      // display alert
      setAlert({ show: true, msg: "Please enter value", type: "danger" });
      showAlert(true, "danger", "please enter value");
    } else if (name && isEditing) {
      // deal with editing
      setList(
        list.map((item) => {
          if (item.id === editId) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      showAlert(true, "success", "Item updated");
      setName("");
      setEditID(null);
      setIsEditing(false);
    } else {
      const newItems = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItems]);
      setAlert({ show: true, msg: "Item added", type: "success" });

      setName("");
    }
  };

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };
  const removeList = () => {
    showAlert(true, "danger", "empty list");
    setList([]);
  };

  const removeItem = (id) => {
    showAlert(true, "danger", "empty list");
    setList(list.filter((item) => item.id !== id));
  };
  const editItem = (id) => {
    showAlert(true, "success", "Item updated");
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);
  return (
    <section className="section-center">
      <form action="" className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>Grocery bud</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="e.g. eggs"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="submit-btn" type="submit">
            {isEditing ? "edit" : "submit"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={removeList}>
            Clear items
          </button>
        </div>
      )}
    </section>
  );
};

export default App;
