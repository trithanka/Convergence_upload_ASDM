import {
  Home, Table2, Book, User2, Group, 
  // Settings2,
  Target, 
  UserPlus,
  Landmark,
} from "lucide-react";
import { ElementType } from "react";

interface NavSubItems {
  name?: string;
  link?: string;
}

interface NavItem {
  name?: string;
  link?: string;
  icon?: ElementType , 
  subItems?: NavSubItems[];
  target?: string;
  rel?: string;
}

export const NavItems: NavItem[] = [
  {
    name: "Department Status",
    link: "/Dashboard",
    icon: Home,
  },
  {
    name :"Convergence Dashboard",
    link: import.meta.env.VITE_REDIRECT_URL,
    target: "_blank",
    rel:"noopener noreferrer",
    icon: Home,

  },
  {
    name: "Summary Report",
    link: "/SummaryReport",
    icon: UserPlus,
   
  },
  // {
  //   name: "Masters",
  //   link: "",
  //   icon: Settings2,
  //   subItems: [
  //     { name: "Departments", link: "/Departments" },
  //     { name: "Sectors", link: "/Sectors" },
  //     { name: "States & Districts", link: "/States" },
  //   ],
  // },
  {
    name: "Schemes",
    link: "/Scheme",
    icon: Table2,
    // subItems: [
    //   { name: "Manual", link: "/SchemeForm" },
    //   { name: "Bulk Upload", link: "/SchemeExcel" },
    // ],
  },

  {
    name: "Targets",
    link: "/Target",
    icon: Target,
 //   subItems: [
 //     { name: "View Goals", link: "/view-goals" },
 //     { name: "Add Goals", link: "/add-goals" },
  //  ],
  },
  {
    name: "Job Role",
    link: "/Course",
    icon: Book,
    // subItems: [
    //   { name: "E-books", link: "/ebooks" },
    //   { name: "Documents", link: "/documents" },
    // ],
  },
  // {
  //   name: "Training Partners",
  //   link: "/TrainingPartner",
  //   icon: Building2,
  //   // subItems: [
  //   //   { name: "Manage Users", link: "/manage-users" },
  //   //   { name: "User Roles", link: "/user-roles" },
  //   // ],
  // },
  // {
  //   name: "Training Centeres",
  //   link: "/TrainingCenter",
  //   icon: Building2,
  //   // subItems: [
  //   //   { name: "Manage Users", link: "/manage-users" },
  //   //   { name: "User Roles", link: "/user-roles" },
  //   // ],
  // },
  {
    name: "Training Entity",
    link: "",
    icon:Landmark,
    subItems: [
      { name: "Training Partner ", link: "/TrainingPartner" },
      { name: "Training Center", link: "/TrainingCenter" },

      // { name: "Others", link: "/add-building" },
    ],
  },
  
  
 
  
  {
    name: "Batches",
    link: "/Batch",
    icon: Group,
    // subItems: [
    //   { name: "Manage Users", link: "/manage-users" },
    //   { name: "User Roles", link: "/user-roles" },
    // ],
  },
  {
    name: "Candidates",
    link: "/Candidate",
    icon: User2,
    // subItems: [
    //   { name: "Manage Users", link: "/manage-users" },
    //   { name: "User Roles", link: "/user-roles" },
    // ],
  },
 
  //{
    // name: "Assessment",
    // link: "/Assessment",
    // icon: FileSignature,
    // subItems: [
    //   { name: "Manage Users", link: "/manage-users" },
    //   { name: "User Roles", link: "/user-roles" },
    // ],
    //}
  //{
    // name: "Placement",
    // link: "/Placement",
    // icon: Spline,
    // subItems: [
    //   { name: "Manage Users", link: "/manage-users" },
    //   { name: "User Roles", link: "/user-roles" },
    // ],
  //},

  // {
  //   name: "Invoice",
  //   link: "/Invoice",
  //   icon: Receipt,
  //   // subItems: [
  //   //   { name: "Manage Users", link: "/manage-users" },
  //   //   { name: "User Roles", link: "/user-roles" },
  //   // ],
  // },

  // {
  //   name: "Candidate",
  //   link: "/Candidate-Registration",
  //   icon: UserPlus,
   
  // }


 
];
