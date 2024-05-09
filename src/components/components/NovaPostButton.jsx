import React from 'react';
import novaPostLogo from "../../resources/novaPostLogo.png"
import {Button} from "react-bootstrap";

const NovaPostButton = ({ onClick }) => {
    return (
    <Button className="btn btn-danger nova-poshta-button my-1" onClick={onClick}>
      <img src={novaPostLogo} alt={`Nova Post`} style={{maxWidth: '30px', marginRight: '5px'}}/>
      <span>Nova Post</span>
    </Button>
  );
};

export default NovaPostButton;