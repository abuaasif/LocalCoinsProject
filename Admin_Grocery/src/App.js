// Filename - App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import Sidebar from "./components/Sidebar.js";
import Orders from "./pages/Orders.js"; // Import the Orders component
import NonvegItems from "./pages/NonvegItems.js";
import Menu from "./pages/Menu.js";
import ProductsList from "./pages/ProductsList.js";
import Updategrocery from "./pages/Updategrocery.js";

import Dashboard from "./pages/Dashboard.js";
import {
	AboutUs,
	OurAim,
	OurVision,
} from "./pages/AboutUs.js";
import {
	Services,
	ServicesOne,
	ServicesTwo,
	ServicesThree,
} from "./pages/Services.js";
import {
	Events,
	EventsOne,
	EventsTwo,
} from "./pages/Events.js";
import Contact from "./pages/ContactUs.js";
import Support from "./pages/Support.js";
import { UpdateProd } from "./pages/Updategrocery.js";
<Route path="/dashboard" element={<Dashboard />} />



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
				<Route path ="/Updategrocery" element={<Updategrocery />}/>
			</Routes>
			<Routes>
			<Route path="/dashboard" element={<Dashboard />} />
			</Routes>

		</Router>
	);
}

export default App;
