import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import {
	Card,
	CardBody,
	CardTitle,
	CardText
} from 'reactstrap';

import './index.css';

const Footer = (props) => {
	return (
		<div className="height_footer">
			<Card>
				<CardBody>
					<CardTitle className="text-center">Special Title Treatment</CardTitle>
					<CardText className="text-center">With supporting text below as a natural lead-in to additional content.</CardText>
				</CardBody>
			</Card>
		</div>
	);
};

export default Footer;