import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";

export const SidebarData = [
  {
    title: "Dashboards",
    path: "/dashboard",
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />
  },
  // Other menu items...


  {
    title: "Menus",
    path: "/Menu",
    icon: <FaIcons.FaEnvelopeOpenText />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />
  },
  {
    title: "Orders",
    path: "/Orders",
    icon: <FaIcons.FaEnvelopeOpenText />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />
  },
  // {
  //   title: "Restaurant",
  //   path: "/services",
  //   icon: <IoIcons.IoIosPaper />,
  //   iconClosed: <RiIcons.RiArrowDownSFill />,
  //   iconOpened: <RiIcons.RiArrowUpSFill />,

  //   subNav: [
  //     {
  //       title: "Add Restaurant",
  //       path: "/services/services1",
  //       icon: <IoIcons.IoIosPaper />
  //     },
  //     {
  //       title: "Restaurant List",
  //       path: "/services/services2",
  //       icon: <IoIcons.IoIosPaper />
  //     }
  //   ]
  // },
  {
    title: "Products",
    path: "/events",
    icon: <FaIcons.FaEnvelopeOpenText />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Add Products ",
        path: "/events/events1",
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: "Products List",
        path: "/productslist",
        icon: <IoIcons.IoIosPaper />
      }
    ]
  },
  {
    title: "Contact",
    path: "/contact",
    icon: <FaIcons.FaPhone />
  },
  {
    title: "Support",
    path: "/support",
    icon: <IoIcons.IoMdHelpCircle />
  }
];
