import qs from 'query-string';
import React, {Component} from 'react';
import {
  Button,
  Container,
  Divider,
  Icon,
  Message,
  Header,
  Grid,
  List
} from 'semantic-ui-react';

import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

import {countBy} from 'lodash';

// Utilities
const roundToHour = date => {
  const p = 60 * 60 * 1000; // milliseconds in an hour
  return new Date(Math.round(date.getTime() / p ) * p);
}

const shuffleArray = arr => arr.sort(() => Math.random() - 0.5)

const counter = data => {
  return countBy(data, item => {
    return roundToHour(new Date(item.time));
  });
};

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			apps: []
		};
	}

	async componentDidMount() {
    // const api = 'https://airapps-api.now.sh/apps';
    const api = 'http://localhost:3000/apps';

    const response = await fetch(
			`${api}`
		);

		let json = await response.json();

		this.setState({json});

    json.data.map(app => {
    });
	}

  generateGrid () {
    if (!this.state.json) return [];
    return this.state.json.data.map(app => {
      const counts = counter(app.checkins);
      const graphData = Object.keys(counts).map(i => {
        return {time: new Date(i).getHours(), amount: counts[i]};
      });
      return (
      <div>
        <Grid.Row columns={1}>
          <Grid.Column>
            <Header as='h2'>
              {app.name.toUpperCase()}
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Header as='h3'>
              Check-ins over Time
            </Header>
            <LineChart width={600} height={300} data={graphData}
              margin={{top: 5, right: 30, left: 20, bottom: 10}}>
              <XAxis dataKey="time" label='Time (hours)'/>
              <YAxis label='Check ins'/>
              <CartesianGrid strokeDasharray="3 3"/>
              <Tooltip/>
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{r: 5}}/>
            </LineChart>
          </Grid.Column>
          <Grid.Column>
            <Header as='h3'>
              Total check-ins today: {app.totalCheckins}
            </Header>
          </Grid.Column>
          <Grid.Column>
            <Header as='h3'>
              Most Popular Venue: {shuffleArray(['University Avenue', 'Palo Alto', 'East Palo Alto', 'Menlo Park', 'Cupertino', 'Mountain View'])[0]}
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Divider />
      </div>
    )});
  }

	render() {
		return (
      <Container>
        <Divider hidden />
        <Header as='h1' floated='left'>
          Air Apps Dashboard
        </Header>
        <Divider hidden clearing />
        <Grid 
          columns={2}
        >
          {this.generateGrid()}
        </Grid>
      </Container>
		);
	}
}

export default App;
