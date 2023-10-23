import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [updateId, setUpdateId] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateAuthor, setUpdateAuthor] = useState('');

  useEffect(() => {
    axios.get('http://localhost:4000/posts').then((res) => {
      setData(res.data);
    });
  }, []);

  function handleInsert() {
    const newId = data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1;

    const newData = {
      id: newId,
      title: title,
      author: author,
    };

    axios.post('http://localhost:4000/posts', newData).then((response) => {
      const insertedData = response.data;
      setData([...data, insertedData]);
      setTitle('');
      setAuthor('');
    });
  }

  function handleDelete(id) {
    axios.delete(`http://localhost:4000/posts/${id}`).then(() => {
      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);
    });
  }

  function handleUpdate(id) {
    const itemToUpdate = data.find((item) => item.id === id);
    if (itemToUpdate) {
      setUpdateId(itemToUpdate.id);
      setUpdateTitle(itemToUpdate.title);
      setUpdateAuthor(itemToUpdate.author);
    }
  }

  function handleUpdateSave() {
    const updatedData = {
      id: updateId,
      title: updateTitle,
      author: updateAuthor,
    };

    axios.put(`http://localhost:4000/posts/${updateId}`, updatedData).then((response) => {
      const updatedItems = data.map((item) => (item.id === updateId ? response.data : item));
      setData(updatedItems);
      setUpdateId('');
      setUpdateTitle('');
      setUpdateAuthor('');
    });
  }

  return (
    <div className="App">
      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Insert
      </button>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Author</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              {/* Update data code*/}
              <td>{item.id === updateId ? (<input type="text" value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)}/>) : (item.title)}</td>
              <td>
                {item.id === updateId ? (
                  <input type="text"  value={updateAuthor}onChange={(e) => setUpdateAuthor(e.target.value)} />) : (item.author)}</td>
              <td>
                {item.id === updateId ? (
                  <div>
                    <button className="btn btn-success" onClick={handleUpdateSave}>Update</button>
                  </div>
                ) : (
                  <div>
                    <button className="btn btn-primary" onClick={() => handleUpdate(item.id)}> Update</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(item.id)}> Delete</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Insert data</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            
            <div className="modal-body">
              <form action="">

                <label htmlFor="title">Title</label>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ marginBottom: '10px' }} />

                <label htmlFor="author">Author</label>
                <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} style={{ marginBottom: '10px' }} />

              </form>
            </div>
            <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary" onClick={handleInsert}>Insert</button>  
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
