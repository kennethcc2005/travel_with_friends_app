import React from 'react';
import { Card, CardTitle } from 'material-ui/Card';
import SearchBox from './SearchBox';

const HomePage = () => (
  <Card className="container">
    <div className="col-xs-6">
        <SearchBox />
    </div>
    <CardTitle title="React Application" subtitle="This is the home page." />
  </Card>
);


export default HomePage;
