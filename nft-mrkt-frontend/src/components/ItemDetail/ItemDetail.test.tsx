import { act, render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Route, Router, Routes } from "react-router-dom";
import "@testing-library/jest-dom";
import ItemDetail from "./ItemDetail";
import { createMemoryHistory } from "history";
import { TestToken } from "../../models/TestModels";
import BackendStubImpl from "../../api/BackendStubImpl";

describe("Test rendering ItemDetails", () => {
  it("Test with navigation location", () => {
    const history = createMemoryHistory();
    const state = { data: TestToken };
    history.push("/", state);
    render(<Router location={history.location} navigator={history}>
      <ItemDetail />
    </Router>);

    expect(
      screen.queryAllByText("test_product_name").length
    ).toBe(1);
  });

  it("Test with injected backend", async () => {
    let api = new BackendStubImpl();
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/itemDetail/0x38bc14caca3d7e9fb096930f91a47dbbbf11b2e2/11"]}>
          <Routes>
            <Route path="/itemDetail/:contractAddress/:tokenID" element={<ItemDetail api={() => api} />} />
          </Routes>
        </MemoryRouter>);
    });
    expect(
      screen.queryAllByText("test_product_name").length
    ).toBe(1);
  });

});
