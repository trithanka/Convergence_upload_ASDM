import {
  Home, Table2, Book, Building2, User2, Users2, Group, FileSignature, Spline, Receipt,
  // Settings2,
  Target
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
}

export const NavItems: NavItem[] = [
  {
    name: "Dashboard",
    link: "/Dashboard",
    icon: Home,
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
    name: "Courses",
    link: "/Course",
    icon: Book,
    // subItems: [
    //   { name: "E-books", link: "/ebooks" },
    //   { name: "Documents", link: "/documents" },
    // ],
  },
  {
    name: "Training Partners",
    link: "/TrainingPartner",
    icon: Building2,
    // subItems: [
    //   { name: "Manage Users", link: "/manage-users" },
    //   { name: "User Roles", link: "/user-roles" },
    // ],
  },
  {
    name: "Training Centeres",
    link: "/TrainingCenter",
    icon: Building2,
    // subItems: [
    //   { name: "Manage Users", link: "/manage-users" },
    //   { name: "User Roles", link: "/user-roles" },
    // ],
  },
  {
    name: "Users",
    link: "",
    icon: Users2,
    subItems: [
      { name: "Assessors", link: "/Assessors" },
      { name: "Trainers", link: "/Trainer" },

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
 
  {
    name: "Assessment",
    link: "/Assessment",
    icon: FileSignature,
    // subItems: [
    //   { name: "Manage Users", link: "/manage-users" },
    //   { name: "User Roles", link: "/user-roles" },
    // ],
  },
  {
    name: "Placement",
    link: "/Placement",
    icon: Spline,
    // subItems: [
    //   { name: "Manage Users", link: "/manage-users" },
    //   { name: "User Roles", link: "/user-roles" },
    // ],
  },

  {
    name: "Invoice",
    link: "/Invoice",
    icon: Receipt,
    // subItems: [
    //   { name: "Manage Users", link: "/manage-users" },
    //   { name: "User Roles", link: "/user-roles" },
    // ],
  },



 
];
