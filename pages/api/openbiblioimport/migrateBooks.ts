import { PrismaClient } from "@prisma/client";
import { BookType } from "../../../entities/BookType";
import type { NextApiRequest, NextApiResponse } from "next";
import { addBook, deleteAllBooks } from "@/entities/book";
import { getUser } from "@/entities/user";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import { UserType } from "@/entities/UserType";

export const TIMEZONE = "Europe/Berlin";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb", // Set desired value here
    },
  },
};

type Data = {
  data: string;
};

type book = {
  book: BookType;
};

//this is some sample data for the migration
const sampleBook = {
  id: 2,
  rentalStatus: "out",
  rentedDate: new Date(),
  dueDate: new Date(),
  renewalCount: 3,
  title: "Buch titel",
  subtitle: "Buch Subtitel",
  author: "Jure",
  topics: "Schlagwort",
  imageLink: "url",
  //additional fields from OpenBiblio data model
  isbn: "123",
  editionDescription: "Edition",
  publisherLocation: "Mammolshain",
  pages: 123,
  summary: "Zusammenfassung",
  minPlayers: "2-3",
  publisherName: "Publish Jure",
  otherPhysicalAttributes: "gebraucht",
  supplierComment: "supplier",
  publisherDate: "yea",
  physicalSize: "xl",
  minAge: "5",
  maxAge: "89",
  additionalMaterial: "CD",
  price: 3,
  userId: 1356,
};

const sampleBookFromOpenBiblio = {
  bibid: "2185",
  copyid: "2185",
  copy_desc: "",
  barcode_nmbr: "2185",
  status_cd: "out",
  status_begin_dt: "2006-06-09 10:17:18",
  due_back_dt: "2006-06-30",
  mbrid: "1035",
  renewal_count: "0",
  create_dt: "2005-05-24 20:08:39",
  last_change_dt: "2023-01-27 10:56:54",
  last_change_userid: "4",
  material_cd: "2",
  collection_cd: "6",
  call_nmbr1: "Bücherei",
  call_nmbr2: "",
  call_nmbr3: "",
  title: "Die Wilden Fußballkerle. Bd. 09: Joschka, die siebte Kavallerie",
  title_remainder: "",
  responsibility_stmt: "",
  author: "Masannek, Joachim",
  topic1: "Fußball",
  topic2: "Teamgeist",
  topic3: "",
  topic4: "",
  topic5: "",
  opac_flg: "Y",
};

const sampleStatusFromOpenBiblio = {
  bibid: "3717",
  copyid: "3696",
  status_cd: "crt",
  status_begin_dt: "2022-11-11 12:19:35",
  due_back_dt: null,
  mbrid: "1428",
  renewal_count: "0",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | BookType>
) {
  if (req.method === "POST") {
    //reset database first for fresh migration, this all needs to be done in one transaction
    const transaction = [];
    //deleteAllBooks(prisma);
    transaction.push(prisma.book.deleteMany({}));
    let importedBooksCount = 0;

    try {
      const booklist = req.body as any;
      //console.log("Booklist", booklist);
      const books = booklist.biblio[2].data;
      const bookStatus = booklist.biblio_hist[2].data;
      const bookExtraFields = booklist.fields[2].data;
      const users = booklist.users[2].data;
      //console.log(users);
      const existingUsers = new Set();
      users.map((u: any) => {
        console.log(u);
        existingUsers.add(parseInt(u.mbrid));
      });

      //First create basic table with the biblio books
      const migratedBooks = books?.map((u: any) => {
        //map the fields from OpenBiblio correctly:
        const book = {
          id: parseInt(u.bibid),
          rentalStatus: (u.status_cd ??= "out"),
          rentedDate: (u.status_begin_dt ??= new Date()),
          dueDate: (u.due_back_dt ??= new Date()),
          renewalCount: parseInt((u.renewal_count ??= 0)),
          title: (u.title ??= "FEHLER Titel nicht importiert"),
          subtitle: (u.title_remainder ??= "FEHLER Titel nicht importiert"),
          author: (u.author ??= "FEHLER Autor nicht importiert"),
          topics:
            (u.topic1 ??= " ") +
            ";" +
            (u.topic2 ??= " ") +
            ";" +
            (u.topic3 ??= " ") +
            ";" +
            (u.topic4 ??= " ") +
            ";" +
            (u.topic5 ??= " "),
          imageLink: "",
        } as BookType;
        //console.log("Adding BookType book", book);
        //transaction.push(addBook(prisma, book));
        //addBook(prisma, book);
        transaction.push(prisma.book.create({ data: { ...book } }));
        importedBooksCount++;
        return book;
      });

      //Attach rental status from history table in OpenBiblio
      let rentalStatusCount = 0;
      const migratedStatus = bookStatus?.map((u: any) => {
        const bibid = parseInt(u.bibid);
        //rented date has format 2022-11-11 12:37:39
        const rentedTime = dayjs(
          u.status_begin_dt,
          "YYYY-MM-DD HH:mm:ss",
          true
        ).isValid()
          ? dayjs(u.status_begin_dt, "YYYY-MM-DD HH:mm:ss", true).toDate()
          : undefined;
        const dueDate = dayjs(u.due_back_dt, "YYYY-MM-DD", true).isValid()
          ? dayjs(u.due_back_dt, "YYYY-MM-DD", true).toDate()
          : undefined;

        //console.log("Timestamps: ", rentedTime, dueDate);

        //connect the book to the user, if it still exists

        //console.log("Connecting user ", u.mbrid);
        if (existingUsers.has(parseInt(u.mbrid))) {
          transaction.push(
            prisma.user.update({
              where: {
                id: parseInt(u.mbrid),
              },
              data: {
                books: {
                  connect: {
                    id: parseInt(u.bibid),
                  },
                },
              },
            })
          );
        }

        // update the rest
        const bookUpdate = {
          rentalStatus: u.status_cd,
          rentedDate: rentedTime,
          dueDate: dueDate,
          renewalCount: parseInt(u.renewal_count),
        } as BookType;

        transaction.push(
          prisma.book.update({
            where: {
              id: bibid,
            },
            data: { ...bookUpdate },
          })
        );
      });

      //Attach additional fields from the fields table in OpenBiblio
      let additionalFieldsCount = 0;

      //execute all queries in sequential order
      prisma.$transaction(transaction);

      res.status(200).json({
        data: `${importedBooksCount} Books created with ${rentalStatusCount} rental status and ${additionalFieldsCount} fields`,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ data: "ERROR: " + error });
    }
  }
}
