import { createTheme, ThemeProvider } from "@mui/material/styles";
import styles from "@/styles/Home.module.css";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Image from "next/image";
import { deDE as coreDeDE } from "@mui/material/locale";
import SelectReport from "@/components/reports/SelectReport";
import Layout from "@/components/layout/Layout";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../entities/user";
import { getAllBooks, getRentedBooksWithUsers } from "@/entities/book";
import { PrismaClient } from "@prisma/client";

import { translations } from "@/entities/fieldTranslations";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import AccountCircle from "@mui/icons-material/AccountCircle";

import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbar,
  deDE,
} from "@mui/x-data-grid";
import dayjs from "dayjs";

import type {} from "@mui/x-data-grid/themeAugmentation";
import { convertDateToDayString } from "@/utils/convertDateToDayString";
import Dashboard from "@/components/reports/Dashboard";
import { UserType } from "@/entities/UserType";
import { BookType } from "@/entities/BookType";
import palette from "@/styles/palette";

const prisma = new PrismaClient();

const theme = createTheme(
  {
    palette: {
      primary: { main: "#1976d2" },
    },
  },
  deDE, // x-data-grid translations
  coreDeDE // core translations
);

interface UsersPropsType {
  users: Array<UserType>;
  books: Array<BookType>;
  rentals: any;
}

export default function Users({ users, books, rentals }: UsersPropsType) {
  const [userSearchInput, setUserSearchInput] = useState("");
  useEffect(() => {}, []);

  const handleInputChange = (e: any) => {
    setUserSearchInput(e.target.value);
  };

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
          sx={{ mt: 2 }}
        >
          <Grid item xs={12}>
            <FormControl variant="standard">
              <InputLabel htmlFor="input-with-icon-adornment">
                Nutzer
              </InputLabel>
              <Input
                id="input-with-icon-adornment"
                startAdornment={
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                }
                value={userSearchInput}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>{" "}
          <Grid item xs={12}>
            {users.map((u) => {
              const searchString = userSearchInput;
              if (
                u.lastName.toLowerCase().includes(searchString.toLowerCase()) ||
                u.firstName.toLowerCase().includes(searchString.toLowerCase())
              )
                return (
                  <Typography key={u.id} color={palette.primary.main}>
                    {u.lastName + ", " + u.firstName}
                  </Typography>
                );
            })}
          </Grid>
        </Grid>
      </ThemeProvider>
    </Layout>
  );
}

export async function getServerSideProps() {
  const allUsers = await getAllUsers(prisma);

  const users = allUsers.map((u) => {
    const newUser = { ...u } as any; //define a better type there with conversion of Date to string
    newUser.createdAt = convertDateToDayString(u.createdAt);
    newUser.updatedAt = convertDateToDayString(u.updatedAt);
    return newUser;
  });

  const allBooks = await getAllBooks(prisma);
  const books = allBooks.map((b) => {
    const newBook = { ...b } as any; //define a better type there with conversion of Date to string
    newBook.createdAt = convertDateToDayString(b.createdAt);
    newBook.updatedAt = convertDateToDayString(b.updatedAt);
    newBook.rentedDate = b.rentedDate
      ? convertDateToDayString(b.rentedDate)
      : "";
    newBook.dueDate = b.dueDate ? convertDateToDayString(b.dueDate) : "";
    //temp TODO
    return newBook;
  });
  const allRentals = await getRentedBooksWithUsers(prisma);
  const rentals = allRentals.map((r) => {
    //calculate remaining days for the rental
    const due = dayjs(r.dueDate);
    const today = dayjs();
    const diff = today.diff(due, "days");

    return {
      id: r.id,
      title: r.title,
      lastName: r.user?.lastName,
      firstName: r.user?.firstName,
      remainingDays: diff,
      dueDate: convertDateToDayString(due.toDate()),
      renewalCount: r.renewalCount,
    };
  });

  //console.log(allRentals);

  // Pass data to the page via props
  return { props: { users, books, rentals } };
}
