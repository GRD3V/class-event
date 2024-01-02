// @ts-check

import { expect, it, beforeEach, describe, vi } from "vitest";
import { ClassEvent } from "../src";

/**
 * @typedef PointEventMap
 * @property { {x: number; y: number;} } move
 */

/**
 * @class
 * @extends { ClassEvent<PointEventMap> }
 */
class Point extends ClassEvent {
  x = 0;
  Y = 0;

  move(x, y) {
    this.emit("move", { x, y });
  }
}

describe("ClassEvent class", () => {
  /** @type {Point} */
  let point;

  beforeEach(() => {
    point = new Point();
  });

  it("should trigger the 'move' event with the correct arguments", async () => {
    const handler_move = vi.fn();

    // Arrange
    point.on("move", handler_move);

    // Handle
    point.move(1, 2);

    // Assert
    expect(handler_move).toBeCalledWith({ x: 1, y: 2 });
  });

  it("should not trigger the 'move' event with the correct arguments", async () => {
    const handler_move = vi.fn();

    // Arrange
    point.on("move", handler_move);
    point.off("move", handler_move);

    // Handle
    point.move(1, 2);

    // Assert
    expect(handler_move).not.toBeCalled();
  });

  it("should limit event registration to a maximum of 3 listeners", async () => {
    const handler_move1 = vi.fn();
    const handler_move2 = vi.fn();
    const handler_move3 = vi.fn();
    const handler_move4 = vi.fn();

    // Arrange
    point.maxEventListeners = 3;
    point.on("move", handler_move1);
    point.on("move", handler_move2);
    point.on("move", handler_move3);
    point.on("move", handler_move4);

    // Handle
    point.move(1, 2);

    // Assert
    expect(handler_move1).toBeCalledWith({ x: 1, y: 2 });
    expect(handler_move2).toBeCalledWith({ x: 1, y: 2 });
    expect(handler_move3).toBeCalledWith({ x: 1, y: 2 });
    expect(handler_move4).not.toBeCalled();
  });
});
