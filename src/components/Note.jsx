import { useState, useEffect } from "react";
import Circle from "../assets/circle.png";
import Edit from "../assets/edit.png";
import Delete from "../assets/delete.png";
import Save from "../assets/save.png";

const NoteTodo = () => {
  const [list, setList] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [editInputTask, setEditInputTask] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [inputData, setInputData] = useState({
    id: null,
    category: "",
    title: "",
    note: "",
    completed: false,
  });

  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${day}-${month}-${year}`;

  const maxLength = 300;
  const handleAddNote = async (e) => {
    e.preventDefault();

    const newNote = {
      id: Math.random(), // You can use a more robust method for generating IDs
      category: inputData.category,
      title: inputData.title,
      note: inputData.note,
    };
    setList([...list, newNote]);
    setShowInput(false);

    setInputData({
      id: null,
      category: "",
      title: "",
      note: "",
      completed: false,
    });
  };
  const onChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
    console.log(inputData);
  };

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem("list")) || [];
    if (storedTodos.length > 0) {
      setList(storedTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  const handleBtnAddNote = () => {
    setShowInput(true);
  };

  const handleCancleAdd = () => {
    setShowInput(false);
  };

  const handleDeleteNote = (id) => {
    const newList = list.filter((todo) => todo.id !== id);
    setList(newList);
  };

  const handleEditNote = (id) => {
    const todoToEdit = list.find((todo) => todo.id === id);
    setEditTodo(id);
    setEditInputTask({ ...todoToEdit });
  };

  const handleSaveEdit = () => {
    const updatedList = list.map((todo) => (todo.id === editTodo ? { ...todo, ...editInputTask } : todo));

    setList(updatedList);
    setEditTodo(null);
    setEditInputTask(null);
  };

  const handleComplete = (id) => {
    const updatedList = list.map((note) => (note.id === id ? { ...note, completed: !note.completed } : note));
    setList(updatedList);
  };
  return (
    <>
      <div className="conatiner">
        <nav className=" bg-[#711DB0] flex justify-between items-center px-7 py-3 w-[94%] m-auto mt-5 rounded-md">
          <div className="search-wrapper">
            <input type="text" placeholder="seacrh note category" className="p-2 w-[300px] rounded-md outline-none " value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          </div>
          <div className="logo flex items-center gap-4">
            <h1 className="font-bold text-white text-1xl">NoteApp.</h1>
          </div>
        </nav>

        <div>
          {showInput ? (
            <>
              <form onSubmit={handleAddNote} className="input-note bg-[#DFCCFB] w-[400px] p-4 mx-10 mt-8 rounded-md">
                <div className="wrapper-title flex flex-col mb-4">
                  <label className="mb-2">Category : </label>
                  <input type="text" placeholder="Example : Reminder" className="p-2 outline-none rounded-md" name="category" onChange={onChange} />
                </div>
                <div className="wrapper-title flex flex-col mb-4">
                  <label className="mb-2">Title : </label>
                  <input type="text" placeholder="Example : Save Money" className="p-2 outline-none rounded-md" name="title" onChange={onChange} />
                </div>
                <div className="wrapper-title flex flex-col">
                  <label className="mb-2">Note : </label>
                  <textarea maxLength={maxLength} type="text" placeholder="Note" className="p-2 outline-none rounded-md" name="note" value={inputData.note} onChange={onChange} />
                  <p>
                    Characters left: {maxLength - inputData.note.length}/{maxLength}
                  </p>
                </div>
                <div className="warpper-button mt-4 flex justify-between">
                  <button type="submit" className="bg-teal-500 w-[100px] p-2 text-white rounded-xl">
                    ADD
                  </button>
                  <button className="bg-red-500 w-[100px] p-2 text-white rounded-xl" onClick={handleCancleAdd}>
                    Cancel
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="px-10 mt-6 ">
              <button className="bg-[#FFB534] text-white p-3 text-1xl rounded-md" onClick={handleBtnAddNote}>
                + Add Note
              </button>
            </div>
          )}
        </div>
        <div>
          <div className="warrper-note flex justify-around gap-5 flex-row flex-wrap w-[100%] h-auto  mt-6 pb-20">
            {list
              .filter((item) => item.category.toLowerCase().includes(searchInput.toLowerCase()))
              .map((item) => (
                <div key={item.id} className={`w-[400px] h-[360px] rounded-md   mb-5 shadow-md relative ${item.completed ? "line-through text-gray-500" : "bg-[#DFCCFB]"}`}>
                  <h1 className="text-center bg-[#F4F27E] w-[90px] m-auto my-3 p-2 rounded-xl font-bold">{item.category}</h1>
                  <p className="px-3 underline text-[14px] font-semibold text-end text-slate-400">{currentDate}</p>
                  <div className="wrapper-title flex gap-2 w-[70%] px-3 items-center">
                    <img src={Circle} alt="circle icon"></img>
                    {editTodo === item.id ? (
                      <input type="text" value={editInputTask.title} onChange={(e) => setEditInputTask({ ...editInputTask, title: e.target.value })} className="p-2 outline-none" />
                    ) : (
                      <p className="text-[16px] font-semibold text-[#0D1282]">{item.title}</p>
                    )}
                  </div>
                  {editTodo === item.id ? (
                    <textarea
                      maxLength={maxLength}
                      placeholder="Note"
                      className="p-2 outline-none rounded-md px-3 mt-3 h-[170px] overflow-hidden w-[100%]"
                      name="note"
                      value={editInputTask.note}
                      onChange={(e) => setEditInputTask({ ...editInputTask, note: e.target.value })}
                    />
                  ) : (
                    <p className="px-3 pt-3 h-[175px] overflow-hidden font-sans font-[300]">{item.note}</p>
                  )}
                  <div className="btn-extra flex gap-3 justify-end pr-3 pt-3 absolute right-0 bottom-[20px]">
                    {editTodo === item.id ? (
                      <button onClick={() => handleSaveEdit(item.id)}>
                        <img src={Save}></img>
                      </button>
                    ) : (
                      <>
                        <button onClick={() => handleComplete(item.id)} className="text-[#FE0000] mr-[258px]">
                          {item.completed ? "Undo" : "Done"}
                        </button>
                        <button onClick={() => handleEditNote(item.id)}>
                          <img src={Edit}></img>
                        </button>
                        <button onClick={() => handleDeleteNote(item.id)}>
                          <img src={Delete}></img>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NoteTodo;
