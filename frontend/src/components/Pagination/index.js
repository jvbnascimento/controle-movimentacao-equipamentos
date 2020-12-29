import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import React from 'react';

import {
	Pagination,
	PaginationItem,
	PaginationLink
} from 'reactstrap';

const PaginationComponent = (props) => {
	return (
		<Pagination className="margin_top_20 center">
			{
				props.pages.map((page, index) => {
					if (page === props.left) {
						return (
							<PaginationItem key={index}>
								<PaginationLink
									className="font_color_verde_zimbra_hover"
									previous
									href="#"
									onClick={e => props.handleCurrentPage(e, ((props.currentPage) - (props.pageNeighbours * 2) - 1))}
								/>
							</PaginationItem>
						);
					}

					if (page === props.right) {
						return (
							<PaginationItem key={index}>
								<PaginationLink
									className="font_color_verde_zimbra_hover"
									next
									href="#"
									onClick={e => props.handleCurrentPage(e, ((props.currentPage) + (props.pageNeighbours * 2) + 1))}
								/>
							</PaginationItem>
						);
					}

					return (
						<PaginationItem key={index}>
							<PaginationLink
								className={(page) === (props.currentPage) ?
									"bg_color_cinza_zimbra_active" :
									"font_color_verde_zimbra_hover"
								}
								href="#"
								onClick={e => props.handleCurrentPage(e, (page))}
							> {page} </PaginationLink>
						</PaginationItem>
					);
				})
			}
		</Pagination>
	);
}

export default PaginationComponent;