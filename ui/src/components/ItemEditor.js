import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Component from "@xavisoft/react-component";


export default class ItemEditor extends Component {

   render() {
      return <Dialog open={this.props.open}>
         <DialogTitle>Add {this.props.itemName}</DialogTitle>

         <DialogContent>
            <this.props.formRenderer />
         </DialogContent>

         <DialogActions>
            <Button variant="contained" onClick={this.props.addItem}>
               SUBMIT
            </Button>
            <Button onClick={this.props.close}>
               CLOSE
            </Button>
         </DialogActions>
      </Dialog>
   }
}