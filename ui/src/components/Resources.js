import { Chip, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';


export default function Resources(props) {

   let noDataJsx;

   if (props.items.length === 0) {
      noDataJsx = <p className="grey-text" style={{ marginLeft: 16, fontSize: 24 }}>
         No resources added yet.
      </p>
   }

   return <>
      <Table>
         <TableHead>
            <TableRow>
               <TableCell><b>NAME</b></TableCell>
               <TableCell><b>RESOURCE TYPE</b></TableCell>
               <TableCell><b></b></TableCell>
            </TableRow>
         </TableHead>
         <TableBody>
            {
               props.items.map(item => {

                  const { id, name } = item;
                  let { resource_type } = item;
                  resource_type = resource_type.name;

                  return <TableRow>

                     <TableCell>{name}</TableCell>

                     <TableCell>
                        <Chip label={resource_type} variant="filled" />
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