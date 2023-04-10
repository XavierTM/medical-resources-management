import { Chip, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { formatTimeForDisplay } from "../utils";


export default function Bookings(props) {

   let noDataJsx;

   if (props.items.length === 0) {
      noDataJsx = <p className="grey-text" style={{ marginLeft: 16, fontSize: 24 }}>
         No booking done yet.
      </p>
   }

   return <>
      <Table>
         <TableHead>
            <TableRow>
               <TableCell><b>ID</b></TableCell>
               <TableCell><b>FROM</b></TableCell>
               <TableCell><b>TO</b></TableCell>
               <TableCell><b>INSTITUTION</b></TableCell>
               <TableCell><b>RESOURCES</b></TableCell>
               <TableCell><b></b></TableCell>
            </TableRow>
         </TableHead>
         <TableBody>
            {
               props.items.map(item => {

                  console.log(item);

                  const { id, from, to, resources } = item;
                  let { booked_on } = item;
                  booked_on = booked_on.name;

                  return <TableRow>

                     <TableCell>{id}</TableCell>

                     <TableCell>
                        <Chip label={formatTimeForDisplay(from)} variant="filled" />
                     </TableCell>

                     <TableCell>
                        <Chip label={formatTimeForDisplay(to)} variant="filled" />
                     </TableCell>

                     <TableCell>{booked_on}</TableCell>

                     <TableCell>
                        {
                           resources.map(resource => {
                              return <div style={{ display: 'inline-block', marginRight: 10 }}>
                                 <Chip label={resource.name} variant="filled" />
                              </div>
                           })
                        }
                     </TableCell>

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