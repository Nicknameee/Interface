import React, {useEffect, useState} from "react";
import {WaitingListProduct} from "../../../schemas/data/WaitingListProduct.ts";
import {getWaitingList, removeFromWaitingList} from "../../../index";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import defaultImage from "../../../resources/imageNotFoundResource.png";
import nothingHereSeems from "../../../resources/oh.png";
import {redirectToProductPage, redirectToUI} from "../../../utilities/redirect";
import {Button, Card} from "react-bootstrap";

const WaitingList = () => {
    const [waitingList: WaitingListProduct[], setWaitingList] = useState([]);
    const [updateCount, setUpdateCount] = useState(1);

    useEffect(() => {
        const init = async () => {
            const waitingList: WaitingListProduct[] = await getWaitingList();
            setWaitingList(waitingList);
        }

        init()
    }, [updateCount]);

    return (
        <div className="w-100 d-flex flex-wrap justify-content-center">
            {
                waitingList.length > 0 ? waitingList.map((item: WaitingListProduct) =>
                        <Card className="mb-3 w-25 mx-3 card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', minHeight: '190px'}}>
                            <Card.Img
                                variant="top"
                                src={item.introductionPictureUrl || defaultImage}
                                style={{ minWidth: '150px', width: '190px', height: '150px', borderRadius: '15%' }}
                                className="m-3"
                            />
                            <Card.Body className="d-flex flex-column justify-content-between">
                                <Card.Title title={'Check product page'} onClick={() => redirectToProductPage(item.productId)} style={{cursor: 'pointer', textDecoration: 'underline'}}>{item.name}</Card.Title>
                                <Card.Text>
                                    Cost: {item.cost} {item.currency}
                                </Card.Text>
                                <Button variant="danger" onClick={() => {
                                    removeFromWaitingList(item.productId);
                                    setUpdateCount(updateCount + 1)
                                }
                                }>
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                            </Card.Body>
                        </Card>
                )
                    :
                <div className="w-100 h-100 d-flex justify-content-center align-items-center flex-wrap">
                    <img src={nothingHereSeems} className="w-auto mb-5" alt="Nothing Here"/>
                    <h1 className="w-100 d-flex justify-content-center">You have no products in your waiting list...</h1>
                    <h3 onClick={() => redirectToUI()} className="text-decoration-underline" style={{cursor: 'pointer'}}>Go to main</h3>
                </div>
            }
        </div>
    )
}

export default WaitingList;