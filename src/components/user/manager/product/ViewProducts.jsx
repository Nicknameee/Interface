import {useEffect, useState} from "react";
import {getProducts} from "../../../../index";
import {Product} from "../../../../schemas/responses/models/Product.ts";
import {ProductFilter} from "../../../../schemas/requests/filters/ProductFilter.ts";
import {Card, CardBody, CardHeader, Collapse, ListGroup, ListGroupItem} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faAngleUp} from "@fortawesome/free-solid-svg-icons";
import {redirectToProductPage} from "../../../../utilities/redirect";

const ViewProducts = () => {
    const [products: Product[], setProducts] = useState([])
    const [productPage: number, setProductPage] = useState(1);
    const [selectedProductId, setSelectedProductId] = useState(null);

    const toggleProduct = (productId) => {
        setSelectedProductId(selectedProductId === productId ? null : productId);
    };

    useEffect(() => {
        const initProducts = async () => {
            const productsData = await getProducts(ProductFilter.build({page: productPage}));

            setProducts(productsData)
        };

        initProducts().then(() => {});
    }, [productPage]);

    return (
        <div style={{height: '100%', overflow: 'scroll', width: '100vw', marginBottom: '10vh'}} className="py-3">
            {
                products !== null && products.length > 0 &&
                products.map((product: Product) => (
                    <Card className="mb-3" key={crypto.randomUUID()}>
                        <CardHeader onClick={() => toggleProduct(product.productId)} style={{ cursor: 'pointer' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>{product.name}</span>
                                <FontAwesomeIcon icon={selectedProductId === product.productId ? faAngleUp : faAngleDown} />
                            </div>
                        </CardHeader>
                        <Collapse in={selectedProductId === product.productId}>
                            <CardBody>
                                <ListGroup>
                                    <ListGroupItem key={crypto.randomUUID()}>
                                        Product Name: <strong title={'Go to product page'} onClick={() => redirectToProductPage(product.productId)}
                                                              style={{cursor: 'pointer', textDecoration: 'underline'}}> {product.name}</strong></ListGroupItem>
                                    <ListGroupItem key={crypto.randomUUID()}>Product Brand: {product.brand}</ListGroupItem>
                                    <ListGroupItem key={crypto.randomUUID()}>Cost: {product.cost} {product.currency}</ListGroupItem>
                                    <ListGroupItem key={crypto.randomUUID()}>Description: {product.description}</ListGroupItem>
                                    <ListGroupItem key={crypto.randomUUID()}>Vendor ID: {product.vendorId}</ListGroupItem>
                                    <ListGroupItem key={crypto.randomUUID()}>Product ID: {product.productId}</ListGroupItem>
                                    <ListGroupItem key={crypto.randomUUID()}>Items Left: {product.itemsLeft}</ListGroupItem>
                                    <ListGroupItem key={crypto.randomUUID()}>Blocked: {String(product.blocked)}</ListGroupItem>
                                    <ListGroupItem key={crypto.randomUUID()}>Category ID: {product.categoryId}</ListGroupItem>
                                    <ListGroupItem key={crypto.randomUUID()}>Margin Rate: {product.marginRate}</ListGroupItem>
                                </ListGroup>
                            </CardBody>
                        </Collapse>
                    </Card>
                ))
            }
        </div>
    )
}

export default ViewProducts;