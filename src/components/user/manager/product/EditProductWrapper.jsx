import {useEffect, useState} from "react";
import {useLocation, useParams} from "react-router-dom";
import {getProduct, getQueryParam} from "../../../../index";
import EditProduct from "./EditProduct";
import {Product} from "../../../../schemas/responses/models/Product.ts";

const EditProductWrapper = () => {
    const location = useLocation();
    const [product: Product, setProduct] = useState(null)

    useEffect(() => {

        const init = async () => {
            const productId = getQueryParam('productId', location)
            const product: Product = await getProduct(productId);
            setProduct(product)

            return product;
        }


        init().then()
    }, []);

    return (
        <EditProduct product={product} />
    )
}

export default EditProductWrapper