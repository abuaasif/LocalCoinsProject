// Filename - App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import Sidebar from "./components/Sidebar";
import Orders from "./pages/Orders.js"; // Import the Orders component
import NonvegItems from "./pages/NonvegItems";
import Menu from "./pages/Menu.js";
import ProductsList from "./pages/ProductsList";
import 'bootstrap/dist/css/bootstrap.min.css';

import Dashboard from "./pages/Dashboard";
import {
	AboutUs,
	OurAim,
	OurVision,
} from "./pages/AboutUs";
import {
	Services,
	ServicesOne,
	ServicesTwo,
	ServicesThree,
} from "./pages/Services";
import {
	Events,
	EventsOne,
	EventsTwo,
} from "./pages/Events";
import Contact from "./pages/ContactUs";
import Support from "./pages/Support";
import { UpdateProd } from "./pages/UpdateProd.js";



function App() {
	return (
		<Router>
			<Sidebar />
			<Routes>
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/about-us" element={<AboutUs />} />
				<Route path="/Menu" element={<Menu />} />
				<Route path="/about-us/aim" element={<OurAim />} />
				<Route path="/about-us/vision" element={<OurVision />} />
				<Route path="/services" element={<Services />} />
				<Route path="/services/services1" element={<ServicesOne />} />
				<Route path="/services/services2" element={<ServicesTwo />} />
				<Route path="/services/services3" element={<ServicesThree />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/events" element={<Events />} />
				<Route path="/events/events1" element={<EventsOne />} />
				<Route path="/events/events1/:id" element={<EventsOne />} />
				<Route path="/events/events2" element={<EventsTwo />} />
				<Route path="/support" element={<Support />} />
				<Route path="/orders" element={<Orders />} />
				<Route path="/ProductsList" element={<ProductsList />} />
				<Route path="/NonvegItems" element={<NonvegItems />} />
				<Route path ="/UpdateProd" element={<UpdateProd />}/>
			</Routes>
		</Router>
	);
}

export default App;
