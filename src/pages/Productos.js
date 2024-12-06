import React, { useState, useEffect } from 'react';
import { getProductos, createProducto, updateProducto, deleteProducto } from '../services/productoService.js';
import { getCategorias } from '../services/categoriaService.js';

const Products = () => {
  const [productos, setProducts] = useState([]);
  const [nombre, setName] = useState('');
  const [descripcion, setDescription] = useState('');
  const [editing, setEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [message, setMessage] = useState('');
  const [categorias, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProductos();
      setProducts(response);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setMessage('Error al cargar productos');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategorias();
      setCategories(response);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setMessage('Error al cargar categorías');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productoData = {
      nombre,
      descripcion,
      categoriaId: parseInt(selectedCategory)
    };

    console.log('Producto Data:', productoData);

    try {
      if (editing) {
        await updateProducto(editProductId, productoData);
        setMessage('Producto actualizado exitosamente');
      } else {
        await createProducto(productoData);
        setMessage('Producto agregado exitosamente');
      }
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      setMessage(`Error al ${editing ? 'actualizar' : 'agregar'} producto`);
    }
  };

  const handleEdit = (product) => {
    if (!product || !product.id) return; 
    setEditing(true);
    setEditProductId(product.id);
    setName(product.nombre);
    setDescription(product.descripcion);
    setSelectedCategory(product.Categoria ? product.Categoria.id : '');
  };
  


  const handleDelete = async (productId) => {
    try {
      await deleteProducto(productId);
      setMessage('Producto eliminado');
      fetchProducts();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      setMessage('Error al eliminar producto');
    }
  };

  const resetForm = () => {
    setEditing(false);
    setEditProductId(null);
    setName('');
    setDescription('');
    setSelectedCategory('');
  };

  const filteredProducts = filterCategory
    ? productos.filter((product) => product.Categoria && product.Categoria.id === parseInt(filterCategory))
    : productos;

  return (
    <div className="products-container">
      <h2>{editing ? 'Editar Producto' : 'Agregar Producto'}</h2>
      <form onSubmit={handleSubmit}>
        <div className='NombreProducto'> 
        <input
          type="text"
          value={nombre}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del producto"
          required
        /> </div>
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción"
          required
        />
        
        <div className='EscogerCategoria'>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          required
        >
          <option value="">Seleccionar categoría</option>
          {categorias.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nombre}
            </option>
          ))}
        </select>
        </div>


         <div className='BotonProducto'>
        <button type="submit">{editing ? 'Actualizar' : 'Agregar'}</button></div>
       <div className='BotonCancelar'> {editing && <button onClick={resetForm}>Cancelar</button>} </div> 
      </form>
      {message && <p>{message}</p>}

      <h2>Lista de Productos</h2>
      <div className='FiltrarCategoria'>
      <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
        <option value="">Filtrar por categoría</option>
        {categorias.map((category) => (
          <option key={category.id} value={category.id}>
            {category.nombre}
          </option>
        ))}
      </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.nombre}</td>
              <td>{product.descripcion}</td>
              <td>{product.Categoria ? product.Categoria.nombre : 'Sin categoría'}</td>
              <td>
                <button onClick={() => handleEdit(product)}>Editar</button>
                <button onClick={() => handleDelete(product.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default Products;
