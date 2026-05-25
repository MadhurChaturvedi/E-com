(# JavaScript: From Scratch → Advanced (tutorial + examples)

Purpose

- A single-file learning guide that takes you from JS fundamentals to advanced runtime concepts (execution context, call stack, closures, event loop), OOP, and DOM/browser APIs. Each section has concise explanations and runnable examples.

How to use

- For Node examples, run `node file.js` or paste snippets into a Node REPL.
- For browser/DOM examples, paste snippets into DevTools Console or create an HTML file and open it.

1 — Quick setup

- Node: install Node (v18+ recommended). Create `test.js` and run `node test.js`.
- Browser: open DevTools (F12) and paste code into Console, or create `index.html` and include a `<script>` tag.

2 — Basics & syntax

- Values & types
  - Primitives: number, string, boolean, null, undefined, symbol, bigint
  - Objects: plain objects, arrays, functions

Example (Node/browser):

```js
const n = 42; // number
const s = "hello"; // string
const b = true; // boolean
const o = { a: 1 };
const arr = [1, 2, 3];
function add(x, y) {
  return x + y;
}
console.log(typeof n, typeof s, typeof o, Array.isArray(arr));
```

- Variables: `let`, `const`, `var`
  - `const` = immutable binding, not immutable value
  - `let` = block-scoped mutable binding
  - `var` = function-scoped, hoisted (legacy — avoid)

Example:

```js
if (true) {
  var a = 1; // function-scoped
  let b = 2; // block-scoped
}
console.log(a); // 1
// console.log(b); // ReferenceError
```

3 — Scope, hoisting, execution context (brief)

- Each function call creates an execution context (variable environment + scope chain).
- Hoisting: `var` declarations and function declarations are hoisted; `let/const` are hoisted but in TDZ (temporal dead zone).

Example (hoisting):

```js
console.log(foo); // undefined (var hoisted)
var foo = 5;

// function declaration hoisted fully
console.log(bar());
function bar() {
  return "ok";
}

// let/const in TDZ
// console.log(x); // ReferenceError
let x = 10;
```

4 — Call stack & execution order

- The call stack is LIFO: functions push onto stack when called and pop when they return.

Example (call stack tracing):

```js
function a() {
  console.log("a start");
  b();
  console.log("a end");
}
function b() {
  console.log("b start");
  c();
  console.log("b end");
}
function c() {
  console.log("c");
}
a();
/* Output:
a start
b start
c
b end
a end
*/
```

5 — Event loop, microtasks vs macrotasks

- JS has single-threaded execution, but async APIs rely on the event loop.
- Microtasks (Promise callbacks, queueMicrotask) run after current script and before next macrotask. Macrotasks (setTimeout, setInterval, I/O) run from the task queue.

Example (observe ordering):

```js
console.log("script start");

setTimeout(() => console.log("timeout"), 0); // macrotask
Promise.resolve().then(() => console.log("promise")); // microtask

console.log("script end");

// Expected output:
// script start
// script end
// promise
// timeout
```

6 — Closures (live, detailed)

- A closure is a function that remembers the environment where it was created. Closures enable private state and factory functions.

Example (counter factory):

```js
function makeCounter() {
  let count = 0; // private
  return {
    inc() {
      count++;
      return count;
    },
    peek() {
      return count;
    },
  };
}
const c = makeCounter();
console.log(c.inc()); // 1
console.log(c.inc()); // 2
console.log(c.peek()); // 2
```

Common closure pitfalls

- Loop + var: capturing loop variable with `var` leads to unexpected values. Use `let` or create a closure per iteration.

Example pitfall and fix:

```js
// Pitfall (var captures same binding)
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 10); // prints 3,3,3
}

// Fix 1: use let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 10); // 0,1,2
}

// Fix 2: closure per iteration
for (var i = 0; i < 3; i++) {
  ((j) => setTimeout(() => console.log(j), 10))(i);
}
```

7 — Objects, prototypes, and OOP

- JS supports prototype-based inheritance. Modern syntax: `class` (syntactic sugar over prototypes).

Example — constructor + prototype:

```js
function Person(name) {
  this.name = name;
}
Person.prototype.greet = function () {
  return "Hi " + this.name;
};
const p = new Person("Ana");
console.log(p.greet());

// class syntax
class Person2 {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return `Hi ${this.name}`;
  }
}
const p2 = new Person2("Bob");
console.log(p2.greet());
```

OOP tips

- Prefer composition over deep prototype chains for simpler code.

8 — Modules (ESM) & imports

- This project uses ESM (`type: module` in package.json). Use `import` / `export`.

Example:

// lib.js

```js
export function sum(a, b) {
  return a + b;
}
export const PI = 3.14;
```

// main.js

```js
import { sum, PI } from "./lib.js";
console.log(sum(2, 3), PI);
```

9 — DOM fundamentals (browser)

- The DOM is a tree of nodes. Use `document` to query and manipulate elements. Events bubble and can be captured.

Example HTML + script (save as `index.html` and open in browser):

```html
<!doctype html>
<html>
  <body>
    <button id="btn">Click</button>
    <div id="out"></div>
    <script>
      const btn = document.getElementById("btn");
      const out = document.getElementById("out");
      let clicks = 0;
      btn.addEventListener("click", (e) => {
        clicks++;
        out.textContent = `Clicked ${clicks} times`;
      });
    </script>
  </body>
</html>
```

Event delegation example:

```html
<ul id="list">
  <li>One</li>
  <li>Two</li>
  <li>Three</li>
</ul>
<script>
  document.getElementById("list").addEventListener("click", (e) => {
    if (e.target.tagName === "LI") console.log("clicked", e.target.textContent);
  });
</script>
```

10 — Advanced runtime concepts (detailed)

- Execution context & scope chain
  - Global execution context created first. Each function call creates a new execution context with its own variable environment. The scope chain links to outer lexical environments.

- Call stack (synchronous)
  - Functions push onto the stack when called and pop on return.

- Event loop and async
  - When a promise resolves, its `.then` handlers are queued as microtasks.
  - After the current script finishes and microtasks drain, the event loop processes the next macrotask.

Microtask starvation note

- If you schedule an infinite chain of microtasks (Promise.then that queues another Promise.then), macrotasks can be starved.

Example (microtask vs macrotask):

```js
console.log("start");
Promise.resolve().then(() => {
  console.log("micro1");
  Promise.resolve().then(() => console.log("micro2"));
});
setTimeout(() => console.log("macro1"), 0);
console.log("end");

// start
// end
// micro1
// micro2
// macro1
```

11 — Memory, leaks, and best practices

- Avoid accidental globals (missing `let/const`). Use strict mode or modules.
- Remove DOM event listeners when no longer needed.
- Be careful with closures holding large objects — release references when done.

12 — Small project: To‑do app (browser)

Create `todo.html` with this minimal app to practice DOM, events, and localStorage:

```html
<!doctype html>
<body>
	<h3>Todo</h3>
	<input id="task" /> <button id="add">Add</button>
	<ul id="todos"></ul>
	<script>
		const input = document.getElementById('task');
		const list = document.getElementById('todos');
		function render(){
			const items = JSON.parse(localStorage.getItem('todos')||'[]');
			list.innerHTML = '';
			items.forEach((t,i)=>{
				const li = document.createElement('li');
				li.textContent = t;
				const del = document.createElement('button'); del.textContent='x';
				del.addEventListener('click', ()=>{ items.splice(i,1); localStorage.setItem('todos', JSON.stringify(items)); render(); });
				li.appendChild(del);
				list.appendChild(li);
			});
		}
		document.getElementById('add').addEventListener('click', ()=>{
			const items = JSON.parse(localStorage.getItem('todos')||'[]');
			if(input.value.trim()){
				items.push(input.value.trim());
				localStorage.setItem('todos', JSON.stringify(items));
				input.value = '';
				render();
			}
		});
		render();
	</script>
</body>
</html>
```

13 — Exercises (practice)

- Write a function that debounces input calls (useful for search boxes).
- Implement `once(fn)` that returns a function that runs `fn` only the first time.
- Build the todo app and add edit and reorder features.

14 — Further reading & resources

- MDN JavaScript guide: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide
- You Don't Know JS (book series) — deep dive into scope, closures, and async.
- JavaScript info: https://javascript.info/

15 — Next steps I can help with

- Create runnable files/examples in this repo and small tests.
- Walk through any section live (I can edit files and show examples).
- Generate slides or a checklist for daily practice.

If you want, tell me which subsection to expand first (closures, event loop, OOP, or DOM). I can also create runnable example files under `server/js/` for you.)
