import React from 'react';
import { Row, Col, Card, } from "react-bootstrap";

import user from '../../assets/images/user.png';
import userPremium from '../../assets/images/userPremium.png';

function Product({ product, currentProductSelected, handleClick }) {
  return (

    <Card style={{ height: "70vh", width: "20%", borderRadius: "0.6rem" }}>
      <Card.Body >
        <div className="row align-items-center justify-content-center">
          <div className="col-auto">
            {product.name === "Basic" ? <img src={user} style={{ width: "auto", height: "3rem" }} alt="user" /> : <img src={userPremium} style={{ width: "auto", height: "4rem" }} alt="userPremium" />}
          </div>
          <div className="col text-right">
            <h3>{product.name}</h3>
          </div>
        </div>
        <hr />
        <div className="text-gray-500 text-xl mb-2 font-medium">
          {product.name}
        </div>
        <p className="text-pasha text-2xl font-extrabold">{product.price}</p>
        <div className="flex-wrap">
          <div className="leading-none text-gray-500 text-xs font-medium">
            Per {product.interval}
          </div>
          <div className="leading-none text-gray-500 text-xs font-medium mt-1">
            Billed {product.billed}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          {currentProductSelected ? (
            <button
              className="bg-pasha hover:bg-white outline-none hover:text-pasha hover:border hover:border-black text-white focus:bg-white focus:text-pasha font-light py-2 px-4 rounded-lg"
              type="submit"
            >
              <div className="w-auto -mx-2 md:mx-0">Selected</div>
            </button>
          ) : (
              <button
                onClick={() => handleClick(product.key)}
                className="bg-pasha hover:bg-white outline-none hover:text-pasha hover:border hover:border-black text-white focus:bg-white focus:text-pasha font-light py-2 px-4 rounded-lg"
                type="submit"
              >
                <div className="w-auto -mx-2 md:mx-0">Select</div>
              </button>
            )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default Product;
