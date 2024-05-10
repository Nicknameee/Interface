import {Card, CardBody, CardHeader, Collapse, ListGroup, ListGroupItem} from "react-bootstrap";
import {redirectToProductPage} from "../../../utilities/redirect";
import {CustomerOrderedProduct} from "../../../schemas/responses/models/CustomerOrderedProduct.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faAngleUp} from "@fortawesome/free-solid-svg-icons";
import {useLanguage} from "../../../contexts/language/language-context";

const OrderedProducts = ({orderedProducts, toggleProduct, selectedProductId}) => {
    const { language, setLanguage } = useLanguage();

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
                                    {
                                        language === 'EN' ? 'Product Name: ' : 'Назва продукції: '
                                    }
                                    <strong title={'Go to product page'} onClick={() => redirectToProductPage(orderedProduct.product.productId)} style={{cursor: 'pointer', textDecoration: 'underline'}}> {orderedProduct.product.name}</strong>
                                </ListGroupItem>
                                <ListGroupItem key={crypto.randomUUID()}>
                                    {
                                        language === 'EN' ? 'Product Brand: ' : 'Бренд: '
                                    }
                                    {orderedProduct.product.brand}
                                </ListGroupItem>
                                <ListGroupItem key={crypto.randomUUID()}>
                                    {
                                        language === 'EN' ? 'Items Sold: ' : 'Кількість куплених товарів: '
                                    }
                                    {orderedProduct.productAmount}
                                </ListGroupItem>
                                <ListGroupItem key={crypto.randomUUID()}>
                                    {
                                        language === 'EN' ? 'Total Cost: ' : 'Загальна вартість: '
                                    }
                                    {orderedProduct.productAmount} * {orderedProduct.product.cost} = > {orderedProduct.productAmount * orderedProduct.product.cost} {orderedProduct.product.currency}
                                </ListGroupItem>
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