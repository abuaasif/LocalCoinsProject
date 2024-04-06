import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Define styled components for layout
const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  margin-top:100px;
  margin-left:350px;
`;

const Card = styled.div`
  background-color: #05144c;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  cursor: pointer;
  transition: transform 0.3s ease;
  color: white;
  width: 300px; /* Match the width of the images */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.05);
  }
`;

const CardImage = styled.img`
  width: 250px; /* Adjust as needed */
  height: 200px; /* Adjust as needed */
  border-radius: 8px; /* Ensure consistent border radius */
  object-fit: cover; /* Ensure the image covers the entire space */
  transition: transform 0.3s ease; /* Add transition for smoother animation */

  &:hover {
    transform: scale(0.9); 
  }
`;
const CardContent = styled.div`
  margin-top: 10px;
`;

const ProductName = styled.h3`
  margin: 0;
`;

const EditDeleteContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;

  
`;

const EditButton = styled.button`
  background-color: #007bff;
  margin-right: 20px; 
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  &:hover {
    background-color: white;
    color: #007bff;
    transition:0.2s;
  }
`;

const DeleteButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background-color: white;
    color: #dc3545;
    transition:0.2s;
  }
`;

// const ProductsList = () => {
//   // State to store product data
//   const [products, setProducts] = useState([]);

//   // Function to fetch product data from API or mock data
//   const fetchProducts = async () => {
//     // Make API call or use mock data
//     const mockData = [
//       { id: 1, name: 'Product 1', imageUrl: 'https://st2.depositphotos.com/8742624/48962/v/450/depositphotos_489625722-stock-illustration-plastic-red-basket-supermarket-fruit.jpg' },
//       { id: 2, name: 'Product 2', imageUrl: 'https://st2.depositphotos.com/3687485/8249/i/450/depositphotos_82492634-stock-illustration-harvest-time-illustration.jpg' },
//       { id: 3, name: 'Product 3', imageUrl: 'https://img.freepik.com/premium-vector/delicious-food-cartoon_18591-43782.jpg' },
//       { id: 4, name: 'Product 4', imageUrl: 'https://img.freepik.com/premium-vector/vegetables-with-fruits-healthy-food_24877-70663.jpg' },
//       { id: 5, name: 'Product 5', imageUrl: 'https://media.istockphoto.com/id/883143246/vector/processed-food.jpg?s=612x612&w=0&k=20&c=l2vgIZkp42zSx-GHHD-XmBHhZMpcdH7Mu7xdJm9OXsQ=' },
//       { id: 6, name: 'Product 6', imageUrl: 'https://www.shutterstock.com/image-vector/baking-ingredients-tools-kitchen-utensils-260nw-2282704167.jpg' },
//       // Add more products as needed
//     ];
//     setProducts(mockData);
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []); // Fetch products on component mount

//   return (
//     <div>
//       <h1>Products List</h1>
//       <CardContainer>
//         {products.map((product) => (
//           <Card key={product.id}>
//             <CardImage src={product.imageUrl} alt={product.name} />
//             <CardContent>
//               <ProductName>{product.name}</ProductName>
//               <EditDeleteContainer>
//                 <EditButton>Edit</EditButton>
//                 <DeleteButton>Delete</DeleteButton>
//               </EditDeleteContainer>
//             </CardContent>
//           </Card>
//         ))}
//       </CardContainer>
//     </div>
//   );
// };


const Button = styled.button`
  background-color: ${({ bgColor }) => bgColor};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ hoverBgColor }) => hoverBgColor};
    color: ${({ hoverColor }) => hoverColor || 'white'};
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
`;

const FormField = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.label`
  margin-bottom: 5px;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
`;

// ProductsList component
const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({});

  // Fetch products from your API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    // Placeholder: Replace with your actual fetch logic
    const response = await fetch('http://localhost:3100/api/products');
    const data = await response.json();
    setProducts(data);
  };

  const openEditModal = (product) => {
    setCurrentProduct(product);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({ ...prev, [name]: value }));
  };

  const saveEditedProduct = async () => {
    await fetch('http://localhost:3100/updateProduct', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentProduct),
    });
    setIsEditModalOpen(false);
    fetchProducts(); // Reload products after editing
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <div>
      <h1>Products List</h1>
      <CardContainer>
        {products.map((product) => (
          <Card key={product.prod_id}>
            <CardImage src={product.image} alt={product.product_name} />
            <CardContent>
              <ProductName>{product.product_name}</ProductName>
              <EditDeleteContainer>
                <Button bgColor="#007bff" hoverBgColor="#0056b3" onClick={() => openEditModal(product)}>Edit</Button>
                <Button bgColor="#dc3545" hoverBgColor="#c82333" onClick={() => {/* Add delete functionality */}}>Delete</Button>
              </EditDeleteContainer>
            </CardContent>
          </Card>
        ))}
      </CardContainer>
      {isEditModalOpen && (
        <ModalBackdrop>
          <ModalContent>
            <FormField>
              <Label>Product Name</Label>
              <Input name="product_name" value={currentProduct.product_name || ''} onChange={handleEditChange} />
            </FormField>
            <FormField>
              <Label>Category</Label>
              <Select name="select_category" value={currentProduct.select_category || ''} onChange={handleEditChange}>
                {/* Add options here */}
              </Select>
            </FormField>
            <FormField>
              <Label>Currency</Label>
              <Input name="currency" value={currentProduct.currency || ''} onChange={handleEditChange} />
            </FormField>
            <FormField>
              <Label>Quantity</Label>
              <Input type="number" name="quantity" value={currentProduct.quantity || 0} onChange={handleEditChange} />
            </FormField>
            <FormField>
              <Label>Price</Label>
              <Input type="number" name="price" value={currentProduct.price || 0} onChange={handleEditChange} />
            </FormField>
            <FormField>
              <Label>Description</Label>
              <TextArea name="description" value={currentProduct.description || ''} onChange={handleEditChange} />
            </FormField>
            <FormField>
              <Label>Rating</Label>
              <Input type="number" name="rating" value={currentProduct.rating || 0} onChange={handleEditChange} />
            </FormField>
            <FormField>
              <Label>Image URL</Label>
              <Input name="image" value={currentProduct.image || ''} onChange={handleEditChange} />
            </FormField>
            <Button bgColor="#28a745" hoverBgColor="#218838" onClick={saveEditedProduct}>Save</Button>
            <Button bgColor="#6c757d" hoverBgColor="#5a6268" onClick={closeModal} style={{marginTop: '10px'}}>Close</Button>
          </ModalContent>
        </ModalBackdrop>
      )}
    </div>
  );
};

export default ProductsList;
