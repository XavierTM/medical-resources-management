import { Chip } from "@mui/material";


export default function ResourceTypes(props) {

   let noDataJsx;

   if (props.items.length === 0) {
      noDataJsx = <p className="grey-text" style={{ marginLeft: 16, fontSize: 24 }}>
         No resource type added yet.
      </p>
   }

   return <>
      
      {
         props.items.map(item => {

            const { id, name } = item;

            return <div style={{ margin: 20, display: 'inline-block' }}>
               <Chip label={name} variant="outlined" onDelete={() => props.onDelete(id)} />
            </div>
         })
      }
      

      {noDataJsx}

   </>
}