import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Navlink from './Navlink';
import { Tab, Nav, Button } from "react-bootstrap";

import "./profile.css";
import moment from "moment-timezone";
import { BsArrowUpRightSquareFill } from "react-icons/bs";
import { BsFillPostcardHeartFill } from "react-icons/bs";
import { GrDocumentSound } from "react-icons/gr";
import { BiSolidVideoRecording } from "react-icons/bi";
import Sidebar from "./Sidebar";
import lit from "../images/lit.jpg";
const Profile = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        Axios.get('http://localhost:3002/home', { withCredentials: true })
            .then((response) => {
                if (response.data.loggedIn) {
                    setIsLoggedIn(true);
                } else {
                    navigate('/');
                }
            })
            .catch((error) => {
                console.error('Error checking authentication:', error);
                navigate('/');
            });
    }, [navigate]);
    const [image, setImage] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [isColorModalOpen, setIsColorModalOpen] = useState(false);
    const [selectedProfileTheme, setSelectedProfileTheme] = useState("");
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [checked3, setChecked3] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingMobile, setIsEditingMobile] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [isEditingBookingNotifications, setIsEditingBookingNotifications] =
        useState(false);
    const [bookingNotificationMethods, setBookingNotificationMethods] = useState(
        []
    );
    const [showPassword, setShowPassword] = useState(false);

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setImage(reader.result);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
    };
    const handleEditProfileTheme = () => {
        setIsColorModalOpen(true);
    };
    const onChange1 = () => {
        setChecked1(!checked1); // Toggle the value of checked1
    };

    const onChange2 = () => {
        setChecked2(!checked2); // Toggle the value of checked2
    };

    const onChange3 = () => {
        setChecked3(!checked3); // Toggle the value of checked3
    };

    const handleEditEmailBox = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };
    const handleEditMobileBox = () => {
        setIsEditingMobile(true);
    };

    const handleCancelEdit01 = () => {
        setIsEditingMobile(false);
    };

    const handleEditPasswordBox = () => {
        setIsEditingPassword(true);
    };

    const handleCancelEdit02 = () => {
        setIsEditingPassword(false);
    };
    const handleEditBookingNotifications = () => {
        setIsEditingBookingNotifications(true);
    };

    const handleCancelEdit03 = () => {
        setIsEditingBookingNotifications(false);
    };

    const handleSaveBookingNotifications = () => {
        const selectedMethods = Array.from(
            document.querySelectorAll("input[name=bookingMethod]:checked")
        ).map((checkbox) => checkbox.value);
        setBookingNotificationMethods(selectedMethods);
        setIsEditingBookingNotifications(false);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const timezones = moment.tz.names().map((timezone) => ({
        label: `(GMT${moment.tz(timezone).format("Z")}) ${timezone}`,
        value: timezone,
    }));

    return (
        <div style={{ display: "flex" }}>
            <div>
                <Sidebar />
            </div>
            <div className="litt">

                <div>
                    <img src={lit} className="lit" />
                </div>

                <div className="pageContainer">
                    <Navlink />
                    <div className="padding">
                        <h1 className="page-title" style={{ marginLeft: "100px" }}>Profile</h1>

                        <div className="">
                            <Tab.Container id="left-tabs-example" defaultActiveKey="profile">
                                <div className="flexJustify">
                                    <Nav className="flex-row nav-tabs">
                                        {/* <Nav.Item className='m-2'>
                                    <Nav.Link eventKey="profile">Profile</Nav.Link>
                                </Nav.Item> */}
                                        {/* <Nav.Item className='m-2'>
                                    <Nav.Link eventKey="settings">Settings</Nav.Link>
                                </Nav.Item>
                                <Nav.Item className='m-2'>
                                    <Nav.Link eventKey="account">Account</Nav.Link>
                                </Nav.Item> */}
                                    </Nav>
                                    <div className="btnDiv">
                                        <Link>
                                            <Button variant="dark" style={{ marginLeft: "-350px", marginTop: "-100px" }}>
                                                Save & change
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                <div className=" bb">
                                    <div className="frm">
                                        <form>
                                            {/* <label className="top">Your Functionhall page link</label> */}
                                            {/* <div className="matebox">
                        <div className="sidebox">Functionhall</div>
                        <input
                          type="text"
                          id="username"
                          aria-required="true"
                          placeholder=" functionhall_page34"
                        />
 
                        <div id="topmateIcon">
                          <BsArrowUpRightSquareFill />
                        </div>
                      </div> */}
                                            <div className="ip">
                                                <div className="input-group">
                                                    <input
                                                        required
                                                        type="text"
                                                        name="text"
                                                        autoComplete="off"
                                                        className="input"
                                                    />
                                                    <label className="user-label">First Name</label>
                                                </div>

                                                <div className="input-group">
                                                    <input
                                                        required
                                                        type="text"
                                                        name="text"
                                                        autoComplete="off"
                                                        className="input"
                                                    />
                                                    <label className="user-label">Last Name</label>
                                                </div>
                                            </div>
                                            {/* <div className="namebox">
                        <div className="edit1">
                          <label className="firstName">First Name </label>{" "}
                          <br />
                          <input
                            type="text"
                            id="firstNamebox"
                            placeholder="     First Name"
                          />
                        </div>
                        <div className="edit">
                          <label className="lastName">Last Name </label> <br />
                          <input
                            type="text"
                            id="lastNamebox"
                            placeholder="     Last Name"
                          />
                        </div>
                      </div> */}

                                            <div className="inputboxes">
                                                <div className="input-group">
                                                    <input
                                                        required
                                                        type="text"
                                                        name="text"
                                                        autoComplete="off"
                                                        className="input"
                                                    />
                                                    <label className="user-label">Display Name</label>
                                                </div>
                                                <div className="input-group">
                                                    <input
                                                        required
                                                        type="text"
                                                        name="text"
                                                        autoComplete="off"
                                                        className="input"
                                                    />
                                                    <label className="userr-label">
                                                        {" "}
                                                        Your Functionhall intro(Required)
                                                    </label>
                                                </div>
                                                <div className="input-group">
                                                    <input
                                                        required
                                                        type="text"
                                                        name="text"
                                                        autoComplete="off"
                                                        className="input"
                                                    />
                                                    <label className="userr-label"> About yourself</label>
                                                </div>
                                            </div>
                                            <br />

                                        </form>
                                    </div>

                                    {/* <div className='frm-2'>
                                        <h3>Widgets</h3>
 
                                        <div className="letter">
                                            <BsFillPostcardHeartFill  id='envelope' />
                                            <div className="support">
                                                <h4>Support My Work</h4>
                                                <p>Let followers pay you after booking. <a href='#'>Learn more</a> </p>
                                            </div>
                                            <label className="toggle-switch">
                                                <input type="checkbox" className="tgl" checked={checked1} onChange={onChange1} />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
 
                                        <div className="smart">
                                        <GrDocumentSound  id='bullhorn'/>
                                            <div className="discount">
                                                <h4>Smart discounts</h4>
                                                <p>Increase bookings by offering discounts.<a href='#'>Learn more</a> </p>
                                            </div>
                                            <label className="toggle-switch">
                                                <input type="checkbox" className="tgl" checked={checked2} onChange={onChange2} />
                                                <span className="slider"></span>
                                            </label>
 
                                        </div>
 
                                        <div className="recording">
                                        <BiSolidVideoRecording id='video' />
                                            <div className="camera">
                                                <h4>Sell session recording</h4>
                                                <p>Enable customers to buy session   recordings.<a href='#'>Learn more</a> </p>
                                            </div>
                                            <label className="toggle-switch">
                                                <input type="checkbox" className="tgl" checked={checked3} onChange={onChange3} />
                                                <span className="slider"></span>
                                            </label>
 
                                        </div>
                                        <hr />
                                    </div>
 
                                    <div className="frm-2">
                                        <div>
                                            <h2>Display</h2>
                                            <div className='theme'>
                                                <div className="profileTheme">
                                                    <h6>Profile Theme</h6>
                                                    <p>Customize your profile to your brand</p>
                                                </div>
 
 
                                                <div className="color-modal">
                                                    <div>
                                                        <input
                                                            type="color"
                                                            value={selectedProfileTheme}
                                                            onChange={(e) => setSelectedProfileTheme(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
 
                                                <a href='#' id='theam-edit' onClick={handleEditProfileTheme}>
                                                    Edit</a>
                                            </div>
                                            <hr />
                                            <div className="server">
                                                <div className="order">
                                                    <h6>Service order</h6>
                                                    <p>Arrange service as you would like to display on your page</p>
                                                </div>
                                                <a href='#' id='order-edit' onClick={handleEditProfileTheme}>
                                                    Edit</a>
                                            </div>
 
                                            <div className='social'>
                                                <h2>Social Links</h2>
                                                <div className="add-link">
                                                    + Add social link
          </div>
                                            </div>
                                        </div>
                                    </div> */}
                                    <div></div>
                                </div>

                                {/* <Tab.Pane eventKey="settings">
                                <div className="bg-white">
                                    <div className='payments'>
                                        <div className="time">
                                            <i class="fa fa-map-marker" aria-hidden="true"></i>
                                            <div className="zone">
                                                <h6>Timezone</h6>
                                                <p>Required for timely communications</p>
                                            </div>
                                                <div className="timebox">
                                            <div className="dropdown">
                                                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                                                Select Timezone
                                                </button>
                                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                                {timezones.map((timezone, index) => (
                                                    <li key={index}>
                                                    <a className="dropdown-item" href="#">{timezone.label}</a>
                                                    </li>
                                                ))}
                                                </ul>
                                            </div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="rupees">
                                            <i class="fa fa-suitcase" aria-hidden="true"></i>
                                            <div className="sell">
                                                <h6>
                                                    Sell in
           </h6>
                                                <p>
                                                    Display your services in your prefered currency
          </p>
                                            </div>
                                            <div className="dropup">
 
                                                <div class="btn-group dropup">
                                                    <button type="button" class="btn btn-secondary dropdown-toggle" id='btn-up' data-bs-toggle="dropdown" aria-expanded="false">
                                                        ₹ (Indian Rupee)
          </button>
                                                    <ul class="dropdown-menu">
                                                        <li><a class="dropdown-item" href="#">₹ (Indian Rupee)</a></li>
                                                        <li><a class="dropdown-item" href="#">$ (U.S dollars)</a></li>
                                                        <li><a class="dropdown-item" href="#"> CA$ (Canadian dollars) here</a></li>
                                                        <li><a class="dropdown-item" href="#"> Є (Euro) here</a></li>
                                                 </ul>
                                                </div>
 
                                            </div>
 
                                        </div>
                                        <hr />
 
                                        <div className="payout">
                                            <i class="fa fa-credit-card-alt" aria-hidden="true"></i>
                                            <div className="pay">
                                                <h6>
                                                    Payouts
                                                </h6>
                                                <p>
                                                    Instant and safe payouts to your preferred account
                                               </p>
                                            </div>
                                            <a href='#' id="update">Update</a>
                                        </div>
                                    </div>
 
                                  </div>
 
 
                            </Tab.Pane>
                            <Tab.Pane eventKey="account">
                                <div className="bg-white">
 
                                    <div className="setting">
                                        <div className="your-1">
                                            <h5>Your details</h5>
                                        </div>
                                       <div className='address-1'>
                                            <div className="email">
                                                <p>Email address</p>
                                                {!isEditing ? (
                                                    <span>topmate@gmail.com</span>
                                                ) : (
                                                    <>
                                                        <input type="email" id='inputbox' placeholder="Enter your email" />  
                                                        <button onClick={handleCancelEdit} id='cancel-save'>Save</button>
                                                    </>
                                                )}
                                            </div>
                                            <div className="edit-1">
                                                {!isEditing ? (
                                                    <a href='#' onClick={handleEditEmailBox} style={{ fontWeight: '700' }}>Edit</a>
 
                                                ) : (
                                                    <a href='#' onClick={handleCancelEdit} id='edit-cancel-num' style={{ marginLeft: '-50px', fontWeight: '700'}}>Cancel</a>
                                                )}
                                            </div>
                                        </div>
                                       
                                        <hr style={{ marginTop: isEditing ? '115px' : '40px' }} />
                                         
 
                                        <div className='address-2'>
                                       
                                            <div className="mobile-1">
                                                <p>Mobile number</p>
                                                {!isEditingMobile ? (
                                                    < br/>
                                                ) : (
                                                    <>
                                                        <div className='countries'>
                                                           <span></span>
                                                            <input type="tel" id='numberbox' placeholder="Enter your mobile number"></input>
                                                        </div>
                                                        <button onClick={handleCancelEdit01} id='cancel-save'>Save</button>
                                                    </>
                                                )}
                                            </div>
 
                                                <div className="edit-2">
                                                    {!isEditingMobile ? (
                                                        <a href='#' onClick={handleEditMobileBox} style={{ fontWeight: '700' }}>Edit</a>
                                                    ) : (
                                                        <a href='#' onClick={handleCancelEdit01}  id='edit-cancel' style={{ fontWeight: '700' }}>Cancel</a>
                                                    )}
                                                </div>
                                             </div>
                                           
 
                                        <hr style={{ marginTop:isEditingMobile  ? '120px' : '40px' }} />
                                         
 
                                       
                                                                                         
                                                                    <div className='address-3' >
                                                                        <div className="password-1">
                                                                            <p>Password</p>
                                                                            {!isEditingPassword ? (
                                                                                <span></span>
                                                                            ) : (
                                                                                <>
                                                                                    <input type="password" id='passwordbox' placeholder="Enter your password"/>  
                                                                                    <button onClick={handleCancelEdit02} id='cancel-save-pass'>Save</button>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                        <div className="edit-3" >
                                                                            {!isEditingPassword ? (
                                                                                <a href='#' onClick={handleEditPasswordBox} style={{ fontWeight: '700' }}>Edit</a>
                                                                            ) : (
                                                                                <a href='#' onClick={handleCancelEdit02} id='edit-cancel-pass' style={{ fontWeight: '700' }}>Cancel</a>
                                                                            )}
                                                                        </div>
                                                                    </div>  
 
                                       
 
                                        <hr style={{ marginTop: isEditingPassword ? '130px' : '20px' }} />
                                         
 
 
                                        <div className="not" >
                                            <h5>Notifications</h5>
                                        </div>
 
 
                                        <div className="address-4">
                                            <div className="booking-1">
                                                <p>Booking Notifications</p>
                                                {!isEditingBookingNotifications ? (
                                                    <span>On: Email, Whatsapp  {bookingNotificationMethods.join(',')}</span>
                                                ) : (
                                                    <>
                                                        {['Whatsapp'].map(method => (
                                                            <div key={method}>
                                                                <input type="checkbox" id={method} name="bookingMethod" value={method} defaultChecked={bookingNotificationMethods.includes(method)} />
                                                                <label htmlFor={method}>{method}</label>
                                                            </div>
                                                        ))}
                                                         
                                                        <button onClick={handleSaveBookingNotifications} id='cancel-save'>Save</button>
                                                    </>
                                                )}
                                            </div>
                                            <div className="edit-4" >
                                                {!isEditingBookingNotifications ? (
                                                    <a href='#' onClick={handleEditBookingNotifications}  style={{ fontWeight: '700' }}>Edit</a>
                                                ) : (
                                                    <a href='#' onClick={handleCancelEdit03}  style={{ fontWeight: '700' }}>Cancel</a>
                                                )}
                                            </div>
                                        </div>
                                        <hr style={{ marginTop: isEditingBookingNotifications ? '95px' : '30px' }} />
                                        <div className='address-5'>
                                            <div className="need-1">
                                                <span>Do you need help with your account setings?</span>
                                            </div>
                                            <div className="edit-5">
                                                <a href="#">Send a query</a>
                                            </div>
                                        </div>
 
                                        <button id="logout">Logout</button>
                                        </div>
                                </div>
                           
                               
                            </Tab.Pane> */}
                            </Tab.Container>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;