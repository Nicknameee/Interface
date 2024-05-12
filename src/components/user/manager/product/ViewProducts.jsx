import React, { useEffect, useState } from "react";
import { exportProducts, getProducts, getProductStatistics, getQueryParam } from "../../../../index";
import { Product } from "../../../../schemas/responses/models/Product.ts";
import { ProductFilter } from "../../../../schemas/requests/filters/ProductFilter.ts";
import { Button, Card, CardBody, CardHeader, Collapse, ListGroup, FormCheck, ListGroupItem } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { redirectToProductPage } from "../../../../utilities/redirect";
import { notifyError } from "../../../../utilities/notify.js";
import { BarChart } from "@mui/x-charts";
import { Box, Modal, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import {useLanguage} from "../../../../contexts/language/language-context";

const ViewProducts = () => {
  const [products: Product[], setProducts] = useState([]);
  const [productPage: number, setProductPage] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statistics, setStatistics] = useState([]);
  const location = useLocation();

  const [name, setName] = useState("");
  const [productId, setProductId] = useState("");
  const [priceFrom, setPriceFrom] = useState();
  const [priceTo, setPriceTo] = useState();
  const [isBlocked, setIsBlocked] = useState(false);
  const [isPresent, setIsPresent] = useState(false);

  const { language, setLanguage } = useLanguage();

    const toggleProduct = (productId) => {
    setSelectedProductId(selectedProductId === productId ? null : productId);
  };

  useEffect(() => {
    const initProducts = async () => {
      const productsData = await getProducts(
        ProductFilter.build({ page: productPage, categoryId: getQueryParam("categoryId", location) })
      );

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
        if (language === 'EN') {
            notifyError("Something went wrong");
        } else {
            notifyError('Щось пішло не так')
        }
      });
  }, [isModalOpen, selectedProductId]);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        overflow: "scroll",
        width: "100vw",
        marginBottom: "100px",
      }}
      className="py-3"
    >
      <ListGroup style={{ width: "28%"}}>
        <ListGroupItem className="d-flex justify-content-between align-items-center" style={{ backgroundColor: 'pink' }}>
          <div style={{ whiteSpace: "nowrap", marginRight: 5 }}>
              {
                  language === 'EN' ? 'Name:' : 'Назва:'
              }
          </div>
          <input
            type="text"
            name="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </ListGroupItem>
        <ListGroupItem className="d-flex justify-content-between align-items-center" style={{ backgroundColor: 'pink' }}>
          <div style={{ whiteSpace: "nowrap", marginRight: 5 }}>Id:</div>
          <input
            type="text"
            name="productId"
            className="form-control"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
        </ListGroupItem>
        <ListGroupItem className="d-flex justify-content-between align-items-center" style={{ backgroundColor: 'pink' }}>
          <div style={{ whiteSpace: "nowrap", marginRight: 5 }}>
              {
                  language === 'EN' ? 'Price from:' : 'Ціна від:'
              }
           </div>
          <input
            type="number"
            name="priceFrom"
            className="form-control"
            value={priceFrom}
            onChange={(e) => setPriceFrom(e.target.value)}
          />
        </ListGroupItem>
        <ListGroupItem className="d-flex justify-content-between align-items-center" style={{ backgroundColor: 'pink' }}>
          <div style={{ whiteSpace: "nowrap", marginRight: 5 }}>
              {
                  language === 'EN' ? 'Price to: ' : 'Ціна макс: '
              }
          </div>
          <input
            type="number"
            name="priceTo"
            className="form-control"
            value={priceTo}
            onChange={(e) => setPriceTo(e.target.value)}
          />
        </ListGroupItem>
        <ListGroupItem className="d-flex align-items-center" style={{ backgroundColor: 'pink' }}>
          <div style={{ whiteSpace: "nowrap", marginRight: 5 }}>
              {
                  language === 'EN' ? 'Is blocked: ' : 'Заблоковано: '
              }
          </div>
          <div className="d-flex">
            <FormCheck
              className="w-25"
              key={crypto.randomUUID()}
              checked={isBlocked}
              onChange={(e) => setIsBlocked(e.target.checked)}
            />
          </div>
        </ListGroupItem>
        <ListGroupItem className="d-flex align-items-center" style={{ backgroundColor: 'pink' }}>
          <div style={{ whiteSpace: "nowrap", marginRight: 5 }}>
              {
                  language === 'EN' ? 'Is present: ' : 'Чи доступний: '
              }
          </div>
          <div className="d-flex">
            <FormCheck
              className="w-25"
              key={crypto.randomUUID()}
              checked={isPresent}
              onChange={(e) => setIsPresent(e.target.checked)}
            />
          </div>
        </ListGroupItem>
        <ListGroupItem className="d-flex justify-content-between">
          <Button
            color="primary"
            onClick={() => {
              const initProducts = async () => {
                const productsData = await getProducts(
                  ProductFilter.build({
                    name,
                    priceFrom,
                    priceTo,
                    productIds: productId ? [productId] : null,
                    isBlocked,
                    isPresent,
                    page: productPage,
                    categoryId: getQueryParam("categoryId", location),
                  })
                );

                setProducts(productsData);
              };

              initProducts().then(() => {});
            }}
          >
              {
                  language === 'EN' ? 'Filter' : 'Фільтрувати'
              }
          </Button>
          <Button
            color="primary"
            onClick={() => {
              setIsBlocked(false);
              setIsPresent(false);
              setName("");
              setProductId("");
              setPriceFrom(undefined);
              setPriceTo(undefined);

              const initProducts = async () => {
                const productsData = await getProducts(
                  ProductFilter.build({ page: productPage, categoryId: getQueryParam("categoryId", location) })
                );

                setProducts(productsData);
              };

              initProducts().then(() => {});
            }}
          >
              {
                  language === 'EN' ? 'Drop Filters' : 'Скинути фільтри'
              }
          </Button>
        </ListGroupItem>
      </ListGroup>
      <div style={{ width: "70%" }}>
        {products !== null && products.length > 0 && (
          <Button
            className="my-3 btn btn-secondary"
            onClick={() =>
              exportProducts(
                ProductFilter.build({
                  name,
                  priceFrom,
                  priceTo,
                  productIds: productId ? [productId] : null,
                  isBlocked,
                  isPresent,
                  page: productPage,
                  categoryId: getQueryParam("categoryId", location),
                })
              )
            }
          >
              {
                  language === 'EN' ? 'Export products' : 'Експортувати продукти'
              }
          </Button>
        )}
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
                        {
                            language === 'EN' ? 'Product Name:' : 'Ім\'я продукту:'
                        }
                        {" "}
                      <strong
                        title={"Go to product page"}
                        onClick={() => redirectToProductPage(product.productId)}
                        style={{ cursor: "pointer", textDecoration: "underline" }}
                      >
                        {" "}
                        {product.name}
                      </strong>
                    </ListGroupItem>
                    <ListGroupItem key={crypto.randomUUID()}>
                        {
                            language === 'EN' ? 'Product Brand: ' : 'Бренд продукту: '
                        }
                        {product.brand}</ListGroupItem>
                    <ListGroupItem key={crypto.randomUUID()}>
                        {
                            language === 'EN' ? 'Cost: ' : 'Ціна: '
                        }
                        {product.cost} {product.currency}
                    </ListGroupItem>
                    <ListGroupItem key={crypto.randomUUID()}>
                        {
                            language === 'EN' ? 'Description: ' : 'Опис: '
                        }
                        {product.description}</ListGroupItem>
                    <ListGroupItem key={crypto.randomUUID()}>
                        {
                            language === 'EN' ? 'Product ID: ' : 'Ідентифікатор продукту: '
                        }
                        {product.productId}</ListGroupItem>
                    <ListGroupItem style={{ color: product.itemsLeft < 30 && "red" }} key={crypto.randomUUID()}>
                        {
                            language === 'EN' ? 'Items Left: ' : 'Залишок продукту: '
                        }
                        {product.itemsLeft}
                    </ListGroupItem>
                    <ListGroupItem key={crypto.randomUUID()}>
                        {
                            language === 'EN' ? 'Blocked: ' : 'Заблоковано: '
                        }
                        {String(product.blocked)}</ListGroupItem>
                    <ListGroupItem key={crypto.randomUUID()}>
                        {
                            language === 'EN' ? 'Category ID: ' : 'Ідентифікатор категорії: '
                        }
                        {product.categoryId}</ListGroupItem>
                    <ListGroupItem key={crypto.randomUUID()}>
                        {
                            language === 'EN' ? 'Margin Rate: ' : 'Відношення виручки: '
                        }
                        {product.marginRate}</ListGroupItem>
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
                        {
                            language === 'EN' ? 'Edit' : 'Відредагувати'
                        }
                    </Button>
                    <Button style={{ marginLeft: 20 }} onClick={() => setIsModalOpen(true)}>
                        {
                            language === 'EN' ? 'View statistics' : 'Статистика'
                        }
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
                            {
                                language === 'EN' ? 'Product sales statistics' : 'Статистика продуктового продажу'
                            }
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
        {products.length < 1 && <h4 className="w-100 text-center">
            {
                language === 'EN' ? 'No products were found....' : 'Не знайдено жодного продукта....'
            }
        </h4>
        }
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
    </div>
  );
};

export default ViewProducts;
