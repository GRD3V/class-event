# class-event

`class-event` is a `JavaScript` `npm` module that makes it easy to use events on your classes. You can also take advantage of event typing, which ensures precise arguments when you emit an event or when you listen to it.

### Add `class-event`

```bash
npm install class-event
```

---

## Use `custom-event` with `Javascript` & `JSDoc`

```javascript
// @ts-check

import { ClassEvent } from "class-event";

/**
 * @typedef PointEventMap
 * @property { {x: number; y: number;} } move
 * @property { null } reset
 */

/**
 * @class
 * @extends { ClassEvent<PointEventMap> }
 */
class Point extends ClassEvent {
  x = 0;
  y = 0;

  /**
   * @param { number } x
   * @param { number } y
   * @returns { void }
   */
  move(x, y) {
    this.x = x;
    this.y = y;
    this.emit("move", { x, y });
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.emit("reset", null);
  }
}

const point = new Point();

point.on("move", (position) => {
  console.log(`New position: x:${position.x} y:${position.y}`);
});

point.on("reset", () => {
  console.log(`Position reset`);
});

point.move(1, 2);
point.reset();
```

---

## Use `custom-event` with `Typescript`

```typescript
import { ClassEvent } from "class-event";

type PointEventMap = {
  move: {
    x: number;
    y: number;
  };
  reset: null;
};

class Point extends ClassEvent<PointEventMap> {
  x: number = 0;
  y: number = 0;

  move(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.emit("move", { x, y });
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.emit("reset", null);
  }
}

const point = new Point();

point.on("move", (position) => {
  console.log(`New position: x:${position.x} y:${position.y}`);
});

point.on("reset", (position) => {
  console.log("Position reset");
});

point.move(1, 2);
point.reset();
```
