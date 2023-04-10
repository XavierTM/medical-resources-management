import Component from "@xavisoft/react-component";
import formCss from "../emotionCss/form";
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, FormControl, FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { hideLoading, showLoading } from '../loading';
import { errorToast } from '../toast';
import request from '../request';
import swal from 'sweetalert';
import { formatTimeForDisplay } from "../utils";
import ArrowBackIcon from '@mui/icons-material/ArrowBackIosNew';
import actions from '../actions';


const BOOKING_STAGES = {
   AVAILABILITY: 'availability',
   SELECTION: 'selection'
}

export default class BookingForm extends Component {

   constructor(...args) {
      super(...args);
      this.state = this.defaultState;
   }
   
   defaultState = {
      resourceTypes: [],
      resourceTypesFetched: false,
      selectedResourceTypes: [],
      stage: BOOKING_STAGES.AVAILABILITY,
      availableSlots: [],
      selectedSlot: '',
   }

   onSelectedResourceTypesChange = (event, selectedResourceTypes) => {
      this.updateState({ selectedResourceTypes });
   }

   onSelectedSlotChange = (event, selectedSlot) => {
      this.updateState({ selectedSlot });
   }

   fetchResourceTypes = async () => {
      try {

         showLoading();

         const res = await request.get('/api/resource-types');
         const resourceTypes = res.data;

         this.updateState({ resourceTypes, resourceTypesFetched: true });

      } catch (err) {

      } finally {
         hideLoading()
      }
   }

   checkAvailableSlots = async () => {

      const txtResourceTypes = document.getElementById('txt-resource-types');
      const txtFrom = document.getElementById('txt-from');
      const txtDuration = document.getElementById('txt-duration');

      let resourceTypes = this.state.selectedResourceTypes;
      let from = txtFrom.value;
      let duration = txtDuration.value;

      if (resourceTypes.length === 0) {
         errorToast('Select at least one resource type');
         return txtResourceTypes.focus();
      }

      if (!from) {
         errorToast('Provide the earliest time you need the resource(s)');
         return txtFrom.focus();
      }

      if (!duration || parseFloat(duration) <= 0) {
         errorToast('Provide how long you need the resource(s) for');
         return txtDuration.focus();
      }

      duration = duration * 60 * 1000;
      from = new Date(from).getTime();
      resourceTypes = resourceTypes.map(item => item.id).join(',');

      try {
         showLoading();

         const res = await request.get(`/api/bookings/free-slots?from=${from}&duration=${duration}&resource_types=${resourceTypes}`);
         const availableSlots = res.data;

         this.updateState({
            availableSlots,
            stage: BOOKING_STAGES.SELECTION,
            selectedSlot: '',
            duration,
         });

      } catch (err) {
         swal(String(err));
      } finally {
         hideLoading();
      }
   }
   
   bookSlot = async () => {

      let institutionId = this.state.selectedSlot;

      if (!institutionId)
         return errorToast('Please select the slot you want you book');

      institutionId = parseInt(institutionId);

      const [ slot ] = this.state.availableSlots.filter(item => item.id === institutionId);

      const duration = this.state.duration;
      const from = slot.available_at;
      const book_on = institutionId;

      const resources = slot.resources.map(item => item.id);

      const data = { book_on, from, duration, resources };

      try {

         showLoading();

         const res = await request.post('/api/bookings', data);

         actions.addItem({
            from,
            to: from + duration,
            book_on: slot,
            resources: slot.resources,
            booked_on: slot,
            id: res.data.id,
         });
         
         this.props.close();

      } catch (err) {
         swal(String(err));
      } finally {
         hideLoading();
      }
   }

   backToAvailability = () => {
      return this.updateState({ stage: BOOKING_STAGES.AVAILABILITY });
   }


   componentDidUpdate(prevProps) {
      if (this.props.open && !prevProps.open) {
         this.updateState(this.defaultState);
         this.fetchResourceTypes();
      }
   }

   componentDidMount() {
      this.fetchResourceTypes();
   }

   render() {

      let jsx;
      let primaryBtnAction, primaryBtnCaption, title;

      if (this.state.stage === BOOKING_STAGES.AVAILABILITY) {
         primaryBtnAction = this.checkAvailableSlots;
         primaryBtnCaption = 'CHECK AVAILABILITY';
         title = 'Check available slots';
      } else {
         primaryBtnAction = this.bookSlot;
         primaryBtnCaption = 'BOOK';

         title = <>
            <Button onClick={this.backToAvailability}>
               <ArrowBackIcon />
            </Button>
            Pick a slot
         </>
      }

      title = <h2 className="v-align">{title}</h2>

      if (this.state.stage === BOOKING_STAGES.AVAILABILITY) {
         if (this.state.resourceTypes.length > 0) {
            jsx = <div className={formCss} style={{ maxWidth: 400 }}>

               <Autocomplete
                  multiple
                  id="txt-resource-types"
                  options={this.state.resourceTypes.map(resourceType => ({label: resourceType.name, id: resourceType.id }))}
                  getOptionLabel={option => option.label }
                  value={this.state.selectedResourceTypes}
                  onChange={this.onSelectedResourceTypesChange}
                  isOptionEqualToValue={(option, value) => option.id === value.id }
                  size="small"
                  renderInput={(params) => (
                     <TextField
                        {...params}
                        variant="standard"
                        label="Resources needed"
                        placeholder="Resource"
                        size="small"
                     />
                  )}
               />

               <TextField
                  id="txt-from"
                  label="Starting from"
                  variant="standard"
                  fullWidth
                  size="small"
                  type="datetime-local"
                  InputLabelProps={{
                     shrink: true
                  }}
            />

            <TextField
               id="txt-duration"
               label="Duration (minutes)"
               variant="standard"
               fullWidth
               size="small"
               type="number"
            />

            </div>
         } else {
            let message, btnCaption;

            if (this.state.resourceTypesFetched) {
               message = 'No resource types on the system, you need to add at least one to be able to book';
               btnCaption = 'RELOAD';
            } else {
               message = 'Failed to load resource types';
               btnCaption = 'RETRY';
            }

            jsx = <div>
               <p style={{ color: 'grey', fontSize: 24 }}>
                  {message}
               </p>

               <Button onClick={this.fetchResourceTypes}>
                  {btnCaption}
               </Button>
            </div>
         }
      } else {

         let noSlotsJSX;

         if (this.state.availableSlots.length === 0) {
            noSlotsJSX = <p className="grey-text">
               No institution with a combination of resources you're looking for
            </p>
         }

         jsx = <div style={{ margin: 'auto 30px' }}>
            <FormControl>
            
               <RadioGroup onChange={this.onSelectedSlotChange} value={this.state.selectedSlot}>
                  {
                     this.state.availableSlots.map(slot => {

                        const { id, name, available_at } = slot;

                        const jsx = <div
                           style={{
                              fontSize: 14,
                              fontWeight: 'bold',
                              margin: '10px auto'
                           }}
                        >
                           <div
                              style={{ font: 'inherit' }}
                           >
                              {name}
                           </div>
                           <div
                              style={{ fontSize: 'inherit' }}
                              className="grey-text"
                           >
                              Available on {formatTimeForDisplay(available_at)}
                           </div>

                        </div>

                        return <FormControlLabel value={id} control={<Radio />} label={jsx} />
                     })
                  }
               </RadioGroup>
            </FormControl>

            {noSlotsJSX}
         </div>
      }

      return <Dialog open={this.props.open}>

         <DialogContent>
            {title}
            {jsx}
         </DialogContent>
         

         <DialogActions>
            <Button onClick={primaryBtnAction} variant="contained">
               {primaryBtnCaption}
            </Button>
            <Button onClick={this.props.close}>
               CLOSE
            </Button>
         </DialogActions>
      </Dialog>
   }
}
