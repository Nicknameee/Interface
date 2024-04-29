import {Card, CardBody, CardHeader, Collapse, ListGroup, ListGroupItem} from "react-bootstrap";
import {redirectToProductPage} from "../../../utilities/redirect";
import {CustomerOrderedProduct} from "../../../schemas/responses/models/CustomerOrderedProduct.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faAngleUp} from "@fortawesome/free-solid-svg-icons";

const OrderedProducts = ({orderedProducts, toggleProduct, selectedProductId}) => {
    return (
        <div>
        {
            orderedProducts !== undefined && orderedProducts !== null && orderedProducts.length > 0 && orderedProducts.map((orderedProduct: CustomerOrderedProduct) =>
                <Card className="mb-3" key={crypto.randomUUID()}>
                    <CardHeader onClick={() => toggleProduct(orderedProduct.product.productId)} style={{ cursor: 'pointer' }}>
                        <div className="d-flex justify-content-between align-items-center">
                            <span>{orderedProduct.product.name}</span>
                            <FontAwesomeIcon icon={selectedProductId === orderedProduct.product.productId ? faAngleUp : faAngleDown} />
                        </div>
                    </CardHeader>
                    <Collapse in={selectedProductId === orderedProduct.product.productId}>
                        <CardBody>
                            <ListGroup>
                                <ListGroupItem key={crypto.randomUUID()}>
                                    Product Name: <strong title={'Go to product page'} onClick={() => redirectToProductPage(orderedProduct.product.productId)} style={{cursor: 'pointer', textDecoration: 'underline'}}> {orderedProduct.product.name}</strong></ListGroupItem>
                                <ListGroupItem key={crypto.randomUUID()}>Product Brand: {orderedProduct.product.brand}</ListGroupItem>
                                <ListGroupItem key={crypto.randomUUID()}>Items Sold: {orderedProduct.productAmount}</ListGroupItem>
                                <ListGroupItem key={crypto.randomUUID()}>Total Cost: {orderedProduct.productAmount} * {orderedProduct.product.cost} = > {orderedProduct.productAmount * orderedProduct.product.cost} {orderedProduct.product.currency}</ListGroupItem>
                            </ListGroup>
                        </CardBody>
                    </Collapse>
                </Card>
            )
        }
        </div>
    )
}

export default OrderedProducts