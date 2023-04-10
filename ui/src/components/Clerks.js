import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';


export default function Clerks(props) {

   let noDataJsx;

   if (props.items.length === 0) {
      noDataJsx = <p className="grey-text" style={{ marginLeft: 16, fontSize: 24 }}>
         No clerks added yet.
      </p>
   }

   return <>
      <Table>
         <TableHead>
            <TableRow>
               <TableCell><b>NAME</b></TableCell>
               <TableCell><b>SURNAME</b></TableCell>
               <TableCell><b>EMAIL</b></TableCell>
               <TableCell><b>INSTITUTION</b></TableCell>
               <TableCell><b></b></TableCell>
            </TableRow>
         </TableHead>
         <TableBody>
            {
               props.items.map(item => {

                  const { id, name, surname, email } = item;
                  let { institution } = item;
                  institution = institution.name;

                  return <TableRow>
                     <TableCell>{name}</TableCell>
                     <TableCell>{surname}</TableCell>
                     <TableCell>{email}</TableCell>
                     <TableCell>{institution}</TableCell>
                     <TableCell>
                        <IconButton color="danger" onClick={() => props.onDelete(id) }>
                           <DeleteIcon />
                        </IconButton>
                     </TableCell>
                  </TableRow>
               })
            }
         </TableBody>
      </Table>

      {noDataJsx}

   </>
}