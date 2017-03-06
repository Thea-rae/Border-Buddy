import React, {Component} from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import SingleTraveler from '../components/Admin/SingleTraveler';
import FlightConfirmation from '../components/FlightConfirmation';
import {browserHistory} from 'react-router';
import { updateTraveler } from '../actions/selectedTraveler';
import { checkFlight } from '../actions/flight';


class SingleTravelerContainer extends Component {
	constructor(props) {
		super(props);

		this.state = {
      changed: false,
      open: false
		};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.confirmSubmit = this.confirmSubmit.bind(this);
	}

  handleClose() {
    this.setState({open: false});
  }

  confirmSubmit() {
    const { updateTraveler, routeParams } = this.props;
    const { values } = this.props.form.singleTraveler;
    updateTraveler(values, routeParams.id);
    this.handleClose();
  }


  handleSubmit(e) {
    e.preventDefault();
    const { flightNum, airlineCode, arrivalTime } = this.props.form.singleTraveler.values;
    const day = arrivalTime.getDate();
    const year = arrivalTime.getYear() + 1900;
    const month = arrivalTime.getMonth() + 1;
    this.props.checkFlight(airlineCode, flightNum, year, month, day)
    .then(() => {
      this.setState({ open: true });
    }) 
    .catch(() => {
      this.setState({ open: false });
    })
  }

	render() {
    const confirmActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        label="Submit"
        primary={true}
        onTouchTap={this.confirmSubmit}
      />
    ];

    const cancelActions = [
      <FlatButton
        label="OK"
        primary={true}
        onTouchTap={this.handleClose}
      />
    ];
		return (
    <div>
      <SingleTraveler handleSubmit={this.handleSubmit} changed={this.state.changed} id={this.props.params.id}/>
      <Dialog
        title={(this.props.flight) ? 'Please confirm your flight info' : 'Whoops!'}
        actions={(this.props.flight) ? confirmActions : cancelActions}
        modal={true}
        open={this.state.open}
      >
        {
          this.props.flight ?
            <FlightConfirmation flight={this.props.flight} />
            :
            <h4>Sorry, we could not find your flight</h4>
        }
      </Dialog>
    </div>
    )
	}
}

/*---------------------------REDUX CONTAINER---------------------------*/

const mapStateToProps = ({ form, flight }) => ({ form, flight })

const mapDispatchToProps = dispatch => ({
  updateTraveler: (traveler, id) => dispatch(updateTraveler(traveler, id)),
  checkFlight: (code, flightNum, year, month, day) => dispatch(checkFlight(code, flightNum, year, month, day))
})

export default connect(mapStateToProps, mapDispatchToProps)(SingleTravelerContainer);