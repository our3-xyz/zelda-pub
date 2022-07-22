import { render, screen } from "@testing-library/react";
import ItemCard from "./ItemCard";
import React from "react"
import { StaticRouter } from "react-router-dom/server"
import { TestToken } from "../../../models/TestModels"
import '@testing-library/jest-dom'

describe("Test rendering ItemCard", () => {
  it("Basic elements", () => {
    render(<StaticRouter location="some_location">
      <ItemCard i={TestToken} forSale={true} />
    </StaticRouter>);

    expect(
      screen.getByText("test_product_name")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("purchase-button")
    ).toBeInTheDocument();
  });

  it("Not for sale", () => {
    render(<StaticRouter location="some_location">
      <ItemCard i={TestToken} forSale={false} />
    </StaticRouter>);

    expect(
      screen.queryByTestId("purchase-button")
    ).toBeNull();
  })

})
