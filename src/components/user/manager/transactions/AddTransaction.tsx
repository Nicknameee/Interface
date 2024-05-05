import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import React from "react";
import { createTransaction } from "../../../..";
import { notifySuccess, notifyError } from "../../../../utilities/notify";

const AddTransaction = () => {
  const [number, setNumber] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!number || !paymentAmount) return;

    try {
      await createTransaction(number, Number(paymentAmount));

      notifySuccess("Payment was created successfully");
    } catch (e) {
      notifyError("Something went wrong");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
      <Form onSubmit={handleSubmit} style={{ background: "white", borderRadius: 8, padding: 20, width: 600 }}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label required style={{ fontSize: 16 }}>
            Order number
          </Form.Label>
          <Form.Control
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
            size="lg"
            type="text"
            placeholder="Enter order number"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label required style={{ fontSize: 16 }}>
            Payment amount
          </Form.Label>
          <Form.Control
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            required
            size="lg"
            type="number"
            placeholder="Enter payment amount"
          />
        </Form.Group>
        <Button size="lg" type="submit">
          Add Payment
        </Button>
      </Form>
    </div>
  );
};

export default AddTransaction;
