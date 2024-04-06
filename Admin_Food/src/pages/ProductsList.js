import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
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

// import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';

const ProductsList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/getproducts/all');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      const {message,products} = data
      setProducts(products);
    } catch (error) {
      console.error('Fetching error:', error);
    }
  };

  const deleteProduct = async (productIds) => {
    try {
      await fetch(`http://localhost:3001/api/product/?id=${productIds}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productIds }),
      });
      fetchProducts(); // Refresh the products list after deletion
    } catch (error) {
      console.error('Delete error:', error);
    }
  };
  const navigate = useNavigate()
  const editProduct = async (product) => {

    navigate('/UpdateProd',{state:{product_id:product.prod_id}})
    // // Use simple prompts for demonstration. Replace with a modal in a real app.
    // const newProductName = prompt('Enter new product name:', product.product_name);
    // if (newProductName) {
    //   product.product_name = newProductName; // Update the name in your product object
    //   // Assuming image update is handled separately 
    //   try {
    //     await fetch('http://localhost:3100/updateProduct', {
    //       method: 'PUT',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(product),
    //     });p
    //     fetchProducts(); // Refresh the products list after update
    //   } catch (error) {
    //     console.error('Update error:', error);
    //   }
    // }
  };



  return (
    <div>
      <h1>Products List</h1>
      <CardContainer>
        {products.map((product) => (
          <Card key={product.prod_id}>
            <CardImage src={product.image1} alt={product.product_name} />
            <CardContent>
              <ProductName>product:{product.product_name}</ProductName>
              <ProductName>price:{product.price}</ProductName>
              <EditDeleteContainer>

                <EditButton onClick={() => editProduct(product)}>Edit</EditButton>
                <DeleteButton onClick={() => deleteProduct([product.prod_id])}>Delete</DeleteButton>
              </EditDeleteContainer>
            </CardContent>
          </Card>
        ))}
      </CardContainer>
    </div>
  );
};

export default ProductsList;