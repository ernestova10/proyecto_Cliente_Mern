import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


const ListaUsuario = () => {
  const [lista, setLista] = useState([]);


  useEffect(() => {
    const getUsuarios = async () => {
      const res = await axios.get("http://localhost:4000/api/usuarios");
      setLista(res.data);
    };
    getUsuarios();
  }, []);


  const eliminarUsario = async (id) => {
    await axios.delete(`http://localhost:4000/api/usuarios/${id}`);
    // Actualizar la lista de usuarios después de eliminar uno
    setLista(lista.filter(usuario => usuario._id !== id));
  };


  return (
    <div className="row">
      {lista.map((list) => (
        <div className="col-md-4 p-2" key={list._id}>
          <div className="card">
            <img
              src={list.foto}
              alt={`Foto de ${list.nombre}`}
              className="card-img img-fluid img-thumbnail w-50 mx-auto d-block"
              style={{ width: "200px", height: "200px", objectFit: "cover" }}
            />


            <div className="card-header text-center">
              <h5>
                {list.nombre}
              </h5>
            </div>
            <div className="card-body">
              <p>Apellidos: {list.apellido}</p>
              <p>Edad: {list.edad}</p>
              <p>Teléfono: {list.telefono}</p>
              <p>Correo: {list.correo}</p>
            </div>
            <div className="card-footer text-center">
              <button className="btn btn-dark mx-1" onClick={() => eliminarUsario(list._id)}>
                Eliminar
              </button>
              <Link to={`/edit/${list._id}`} className="btn btn-dark mx-1">
                Editar
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};


export default ListaUsuario;