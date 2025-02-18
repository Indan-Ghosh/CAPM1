namespace srv.booknm;

using { db.booknm as my } from '../db/books';

service BookstoreSrv {

   entity Books as projection on my.Books;
   entity Authors as projection on my.Authors; 
   entity Reviews as projection on my.Reviews;   

}


