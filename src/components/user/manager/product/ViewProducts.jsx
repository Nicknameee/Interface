import React, { useEffect, useState } from "react";
import { getProducts, getProductStatistics } from "../../../../index";
import { Product } from "../../../../schemas/responses/models/Product.ts";
import { ProductFilter } from "../../../../schemas/requests/filters/ProductFilter.ts";
import { Button, Card, CardBody, CardHeader, Collapse, ListGroup, ListGroupItem } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { redirectToProductPage } from "../../../../utilities/redirect";
import { notifyError } from "../../../../utilities/notify.js";
import { BarChart } from "@mui/x-charts";
import { Modal, Box, Typography } from "@mui/material";

const ViewProducts = () => {
  const [products: Product[], setProducts] = useState([]);
  const [productPage: number, setProductPage] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statistics, setStatistics] = useState([]);

  const toggleProduct = (productId) => {
    setSelectedProductId(selectedProductId === productId ? null : productId);
  };

  useEffect(() => {
    const initProducts = async () => {
      const productsData = await getProducts(ProductFilter.build({ page: productPage }));

      setProducts(productsData);
    };

    initProducts().then(() => {});
  }, [productPage]);

  useEffect(() => {
    if (!isModalOpen) return;

    getProductStatistics(selectedProductId)
      .then((statistics) => {
        setStatistics(statistics.slice(0, 16));
      })
      .catch(() => {
        notifyError("Something went wrong");
      });
  }, [isModalOpen, selectedProductId]);

  return (
    <div style={{ height: "100%", overflow: "scroll", width: "100vw", marginBottom: "10vh" }} className="py-3">
      {products !== null &&
        products.length > 0 &&
        products.map((product: Product) => (
          <Card className="mb-3" key={crypto.randomUUID()}>
            <CardHeader onClick={() => toggleProduct(product.productId)} style={{ cursor: "pointer" }}>
              <div className="d-flex justify-content-between align-items-center">
                <span>{product.name}</span>
                <FontAwesomeIcon icon={selectedProductId === product.productId ? faAngleUp : faAngleDown} />
              </div>
            </CardHeader>
            <Collapse in={selectedProductId === product.productId}>
              <CardBody>
                <ListGroup>
                  <ListGroupItem key={crypto.randomUUID()}>
                    Product Name:{" "}
                    <strong
                      title={"Go to product page"}
                      onClick={() => redirectToProductPage(product.productId)}
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                    >
                      {" "}
                      {product.name}
                    </strong>
                  </ListGroupItem>
                  <ListGroupItem key={crypto.randomUUID()}>Product Brand: {product.brand}</ListGroupItem>
                  <ListGroupItem key={crypto.randomUUID()}>
                    Cost: {product.cost} {product.currency}
                  </ListGroupItem>
                  <ListGroupItem key={crypto.randomUUID()}>Description: {product.description}</ListGroupItem>
                  <ListGroupItem key={crypto.randomUUID()}>Vendor ID: {product.vendorId}</ListGroupItem>
                  <ListGroupItem key={crypto.randomUUID()}>Product ID: {product.productId}</ListGroupItem>
                  <ListGroupItem key={crypto.randomUUID()}>Items Left: {product.itemsLeft}</ListGroupItem>
                  <ListGroupItem key={crypto.randomUUID()}>Blocked: {String(product.blocked)}</ListGroupItem>
                  <ListGroupItem key={crypto.randomUUID()}>Category ID: {product.categoryId}</ListGroupItem>
                  <ListGroupItem key={crypto.randomUUID()}>Margin Rate: {product.marginRate}</ListGroupItem>
                  <ListGroupItem key={crypto.randomUUID()}>
                    Intro Picture URL:{" "}
                    {product.introductionPictureUrl ? (
                      <a href={product.introductionPictureUrl} target="_blank">
                        Link
                      </a>
                    ) : (
                      "DEFAULT"
                    )}
                  </ListGroupItem>
                  {product.pictureUrls &&
                    product.pictureUrls.length > 0 &&
                    product.pictureUrls.map((uri) => (
                      <ListGroupItem key={crypto.randomUUID()}>
                        Picture URL:{" "}
                        {uri ? (
                          <a href={uri} target="_blank">
                            Link
                          </a>
                        ) : (
                          "DEFAULT"
                        )}
                      </ListGroupItem>
                    ))}
                </ListGroup>
                <div style={{ marginTop: 20 }}>
                  <Button
                    onClick={() => {
                      window.location.href = "/product/edit?productId=" + product.productId;
                    }}
                  >
                    Edit
                  </Button>
                  <Button style={{ marginLeft: 20 }} onClick={() => setIsModalOpen(true)}>
                    View statistics
                  </Button>
                  <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <Box
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: 4,
                      }}
                      borderRadius="10px"
                      bgcolor="#fff"
                    >
                      <Typography textAlign="center" marginTop="20px" variant="h4">
                        Product sales statistics
                      </Typography>
                      <BarChart
                        dataset={statistics}
                        width={1000}
                        height={500}
                        series={[{ dataKey: "itemsSold" }]}
                        xAxis={[{ data: statistics.map((item) => item.date), scaleType: "band", label: "Date" }]}
                        yAxis={[{ label: "Items sold" }]}
                      />
                    </Box>
                  </Modal>
                </div>
              </CardBody>
            </Collapse>
          </Card>
        ))}
      {products.length < 1 && <h4 className="w-100 text-center">No products were found....</h4>}
      {
        <div className="w-100 d-flex justify-content-center align-items-center">
          <Button
            className="mx-3"
            style={{ width: "100px" }}
            disabled={productPage <= 1}
            onClick={() => {
              if (productPage > 1) {
                setProductPage(productPage - 1);
              }
            }}
          >
            Prev
          </Button>
          <h3 className="font-monospace">{productPage}</h3>
          <Button
            className="mx-3"
            style={{ width: "100px" }}
            onClick={() => {
              if (products.length > 0) {
                setProductPage(productPage + 1);
              }
            }}
          >
            Next
          </Button>
        </div>
      }
    </div>
  );
};

export default ViewProducts;
