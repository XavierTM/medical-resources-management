import Component from "@xavisoft/react-component";
import { hideLoading, showLoading } from "../loading";
import swal from "sweetalert";
import request from "../request";
import actions from "../actions";
import { connect } from "react-redux";
import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ItemEditor from "./ItemEditor";



class ItemManager extends Component {

   state = {
      editorOpen: false
   }

   openEditor = () => {
      return this.setState({ editorOpen: true })
   }

   closeEditor = () => {
      return this.setState({ editorOpen: false })
   }

   fetchItems = async () => {

      try {

         showLoading();

         const res = await request.get(`/api/${this.props.itemGroupName}`);
         actions.setItems(res.data);

      } catch (err) {
         swal(String(err));
      } finally {
         hideLoading();
      }
   }

   addItem = async () => {


      const result = this.props.extractFormData();

      if (!result)
         return;

      const [ item, properties ] = result;

      try {
         
         showLoading();

         const url = `api/${this.props.itemGroupName}`;
         const res = await request.post(url, item);

         actions.addItem({
            ...item,
            ...res.data,
            ...properties,
         });

         this.closeEditor();

      } catch (err) {
         swal(String(err));
      } finally {
         hideLoading();
      }
   }

   deleteItem = async (id) => {

      try {
         
         showLoading();

         const url = `api/${this.props.itemGroupName}/${id}`;
         await request.delete(url);

         actions.deleteItem(id);

      } catch (err) {
         swal(String(err));
      } finally {
         hideLoading();
      }
   }

   componentDidUpdate(prevProps) {
      if (this.props.itemGroupName !== prevProps.itemGroupName) {
         this.fetchItems();
      }
   }

   componentDidMount() {
      this.fetchItems();
   }

   render() {

      let itemEditorJSX;

      if (this.props.editor) {

         itemEditorJSX = <this.props.editor
            open={this.state.editorOpen}
            close={this.closeEditor}
         />

      } else {
         itemEditorJSX = <ItemEditor
            formRenderer={this.props.formRenderer}
            open={this.state.editorOpen}
            close={this.closeEditor}
            addItem={this.addItem}
            itemName={this.props.itemName}
         />
      }

      return <div>
         
         <this.props.listRenderer
            items={this.props.items}
            onDelete={this.deleteItem}
            onAddition={this.addItem}
         />

         {itemEditorJSX}
 
         <Fab
            color="primary"
            style={{
               position: 'fixed',
               bottom: 30,
               right: 30,
            }}
            onClick={this.openEditor}
         >
            <AddIcon />
         </Fab>
      </div>
   }
}


function mapStateToProps(state) {
   return { items: state.items }
}

export default connect(mapStateToProps)(ItemManager);