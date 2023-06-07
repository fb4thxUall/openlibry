import * as React from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import Image from "next/image";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ListItem from "@mui/material/ListItem";

import SaveAltIcon from "@mui/icons-material/SaveAlt";
import ListItemText from "@mui/material/ListItemText";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";

import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import palette from "@/styles/palette";
import {
  Divider,
  Paper,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import { BookType } from "@/entities/BookType";
import { UserType } from "@/entities/UserType";
import { translations } from "@/entities/fieldTranslations";
import BookDateField from "./edit/BookDateField";
import BookTextField from "./edit/BookTextField";
import BookNumberField from "./edit/BookNumberField";
import BookStatusDropdown from "./edit/BookStatusDropdown";
import BookTopicsChips from "./edit/BookTopicsChips";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

interface BookEditFormPropType {
  user: UserType;
  book: BookType;
  setBookData: any;
  deleteBook: any;
  saveBook: any;
  returnBook: any;
  hasImage: boolean;
  topics: string[];
}

interface ReturnBooksType {
  bookid: number;
  time: Date;
}

export default function BookEditForm({
  user,
  book,
  setBookData,
  deleteBook,
  saveBook,
  returnBook,
  hasImage,
  topics,
}: BookEditFormPropType) {
  const [editable, setEditable] = useState(false);

  const [editButtonLabel, setEditButtonLabel] = useState("Editieren");
  const [returnedBooks, setReturnedBooks] = useState({});

  const toggleEditButton = () => {
    editable
      ? setEditButtonLabel("Editieren")
      : setEditButtonLabel("Abbrechen");
    setEditable(!editable);
  };

  const ReturnedIcon = ({ id }: any) => {
    //console.log("Rendering icon ", id, returnedBooks);
    if (id in returnedBooks) {
      return <CheckCircleIcon color="success" />;
    } else {
      return <ArrowCircleLeftIcon />;
    }
  };

  return (
    <Paper sx={{ mt: 5, px: 4 }}>
      <Divider sx={{ mb: 3 }}>
        <Typography variant="body1" color={palette.info.main}>
          Stammdaten des Buchs
        </Typography>
      </Divider>

      <Grid
        container
        direction="row"
        justifyContent="top"
        alignItems="top"
        spacing={2}
      >
        {" "}
        <Grid item xs={12} sm={3}>
          {hasImage && (
            <Image
              src={"/coverimages/" + book.id + ".jpg"}
              width="200"
              height="200"
              alt="cover image"
              style={{
                border: "1px solid #fff",
                width: "auto",
              }}
            />
          )}
        </Grid>{" "}
        <Grid item container xs={12} sm={9} spacing={3}>
          {" "}
          <BookTextField
            fieldType={"title"}
            editable={editable}
            setBookData={setBookData}
            book={book}
          />
          <BookTextField
            fieldType={"author"}
            editable={editable}
            setBookData={setBookData}
            book={book}
          />
          <BookTextField
            fieldType={"subtitle"}
            editable={editable}
            setBookData={setBookData}
            book={book}
          />
          <BookTopicsChips
            fieldType={"topics"}
            editable={editable}
            setBookData={setBookData}
            book={book}
            topics={topics}
          />
          <BookTextField
            fieldType={"summary"}
            editable={editable}
            setBookData={setBookData}
            book={book}
          />
          <BookTextField
            fieldType={"isbn"}
            editable={editable}
            setBookData={setBookData}
            book={book}
          />
          <BookTextField
            fieldType={"editionDescription"}
            editable={editable}
            setBookData={setBookData}
            book={book}
          />
          <BookTextField
            fieldType={"publisherName"}
            editable={editable}
            setBookData={setBookData}
            book={book}
          />
          <BookTextField
            fieldType={"publisherLocation"}
            editable={editable}
            setBookData={setBookData}
            book={book}
          />
          <BookTextField
            fieldType={"publisherDate"}
            editable={editable}
            setBookData={setBookData}
            book={book}
          />
          <BookTextField
            fieldType={"pages"}
            editable={editable}
            setBookData={setBookData}
            book={book}
          />
          <BookTextField
            fieldType={"minAge"}
            editable={editable}
            setBookData={setBookData}
            book={book}
          />
          <BookTextField
            fieldType={"maxAge"}
            editable={editable}
            setBookData={setBookData}
            book={book}
          />
          <BookStatusDropdown
            fieldType={"rentalStatus"}
            editable={editable}
            setBookData={setBookData}
            book={book}
          />
          <BookNumberField
            fieldType={"renewalCount"}
            editable={editable}
            setBookData={setBookData}
            book={book}
          />
          <BookDateField
            fieldType={"rentedDate"}
            editable={editable}
            setBookData={setBookData}
            book={book}
          />
          <BookDateField
            fieldType={"dueDate"}
            editable={editable}
            setBookData={setBookData}
            book={book}
          />
          <BookTextField
            fieldType={"price"}
            editable={editable}
            setBookData={setBookData}
            book={book}
          />
          <BookTextField
            fieldType={"externalLinks"}
            editable={editable}
            setBookData={setBookData}
            book={book}
          />
          <BookTextField
            fieldType={"additionalMaterial"}
            editable={editable}
            setBookData={setBookData}
            book={book}
          />
          <BookTextField
            fieldType={"minPlayers"}
            editable={editable}
            setBookData={setBookData}
            book={book}
          />
          <BookTextField
            fieldType={"otherPhysicalAttributes"}
            editable={editable}
            setBookData={setBookData}
            book={book}
          />
          <BookTextField
            fieldType={"supplierComment"}
            editable={editable}
            setBookData={setBookData}
            book={book}
          />
          <BookTextField
            fieldType={"physicalSize"}
            editable={editable}
            setBookData={setBookData}
            book={book}
          />
          <BookTextField
            fieldType={"additionalMaterial"}
            editable={editable}
            setBookData={setBookData}
            book={book}
          />
        </Grid>
      </Grid>

      <Divider sx={{ mb: 3 }}>
        <Typography variant="body1" color={palette.info.main}>
          Weitere Information
        </Typography>
      </Divider>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs={12} md={4}>
          <Button onClick={toggleEditButton} startIcon={<EditIcon />}>
            {editButtonLabel}
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
          {editable && (
            <Button
              onClick={() => {
                saveBook();
                toggleEditButton();
              }}
              startIcon={<SaveAltIcon />}
            >
              Speichern
            </Button>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          {editable && (
            <Button
              color="error"
              onClick={deleteBook}
              startIcon={<DeleteForeverIcon />}
            >
              Löschen
            </Button>
          )}
        </Grid>{" "}
      </Grid>
    </Paper>
  );
}
