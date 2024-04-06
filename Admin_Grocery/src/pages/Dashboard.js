import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
  grid-gap: 90px;
  padding: 520px;
  padding-right: 30px;
  margin-top: -440px;
 
`;

const Card = styled.div`
  background-color: #05144c;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px 20px 20px;
  cursor: pointer;
  transition: transform 0.3s ease;
  color: white;
  position: relative; /* Ensure position:relative for the parent */
  width:80%;
  

  &:hover {
    transform: scale(1.05);
    color:lightgreen;
    transition:0.2s;
  }
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 50px;
  margin-left:300px;
  margin-top:-70px;
  
`;
const CardDescription = styled.p`
  margin: 10px 0 0;
  margin-left:300px;
  font-size: 30px;
  padding-bottom:60px;
`;

const CardImage = styled.img`
  width: 190px;
  height: 190px;
  border-radius: 50%;
  margin-bottom: -90px;
  transition: transform 0.3s ease; /* Add transition for smooth animation */

  /* Rotate the image slightly on hover */
  ${Card}:hover & {
    transform: rotate(7deg);
  }
`;
const Heading = styled.h1`
  color: #05144c;
  margin-top:150px;
  margin-left:700px;
  font-weight:bold;
`;

const NumberBadge = styled.span`
  position: absolute;
  bottom: 120px; /* Position the badge at the bottom */
  left: 90%; /* Center horizontally */
  transform: translateX(-50%); /* Center horizontally */
  background-color: white;
  color: darkblue;
  border-radius: 30%;
  padding: 9px;
`;

const Dashboard = ({ orderCount = 0, productCount = 0 }) => {
  return (
    <div>
      <Heading>ADMIN DASHBOARD</Heading>
      <CardContainer>
        {/* Card 1 */}
        <Card>
          <div>
            <CardImage
              src="https://i0.wp.com/ivepos.com/wp-content/uploads/2022/07/how-to-connect-restaurant-with-swiggy.jpg?resize=700%2C619&ssl=1"
              alt="Groceries"
            />
          </div>
          <CardTitle>ORDERS</CardTitle>
          <CardDescription>Checkout Orders</CardDescription>
          <NumberBadge>{orderCount}</NumberBadge>
        </Card>
        {/* Card 2 */}
        <Card>
          <CardImage
            src="https://thumbs.dreamstime.com/b/grocery-bag-vector-illustration-isolated-white-groceries-paper-package-flat-cartoon-fresh-food-drink-products-shopping-71908466.jpg"
            alt="Groceries"
          />
          <CardTitle>PRODUCTS</CardTitle>
          <CardDescription>Checkout Products</CardDescription>
          <NumberBadge>{productCount}</NumberBadge>
        </Card>
      </CardContainer>
    </div>
  );
};

export default Dashboard;
