

# **📘 G) MINIMAL TESTING SPECIFICATION**

*(Tests per canonical use case — the minimum set to guarantee correctness.)*

This is the **“hard truth” test suite** that validates your entire runtime end-to-end.

---

# **PHASE 1 — VARIABLE SYSTEM**

Goal: guarantee that environments, resolution, and evaluation behave correctly.

---

# **1) UC01 — `let x = 2`**

### **Tests**

* `[ ]` lexical environment contains `x: 2`
* `[ ]` variable environment is unchanged
* `[ ]` resolve("x") → 2
* `[ ]` snapshot shows LexicalEnv { x: 2 }

### **Failure modes**

* x ends up in variable env
* initializer not evaluated
* resolution fails

---

# **2) UC02 — `var x = 2`**

### **Tests**

* `[ ]` variable environment contains `x: 2`
* `[ ]` lexical env unchanged
* `[ ]` resolve("x") → 2

### **Failure modes**

* x incorrectly stored in lexical env
* lookup fails

---

# **3) UC03 — `const x = 2`**

### **Tests**

* `[ ]` lexical env contains `x: 2`
* `[ ]` reassignment triggers error (or ignored based on design)
* `[ ]` resolve("x") → 2

### **Failure modes**

* missing initializer allowed
* reassignment allowed

---

# **4) UC04 — Identifier Resolution**

### **Tests**

For:

```
let x = 2;
x;
```

* `[ ]` resolve("x") → 2
* `[ ]` resolution works across lexical → outer

Additional nested test:

```
let a = 1;
{
  let b = 2;
  a === 1
  b === 2
}
```

* `[ ]` correct shadowing
* `[ ]` correct lookup chain

---

# **5) UC05 — Binary Expressions**

### **Tests**

```
let x = 1;
let y = 2;
x + y → 3
x * 3 → 3
y > 1 → true
```

* `[ ]` arithmetic operators
* `[ ]` comparator operators
* `[ ]` evaluation order: left then right

---

# **6) UC06 — Assignment**

### **Tests**

```
let x = 1;
x = 5;
```

* `[ ]` lexical env updated to `{ x: 5 }`
* `[ ]` resolve("x") → 5

Nested:

```
let x = 1;
{
  let x = 10;
  x = 20;
}
```

* `[ ]` inner x mutated
* `[ ]` outer x untouched

---

# **PHASE 2 — FUNCTIONS**

Goal: guarantee correct execution context behavior.

---

# **7) UC07 — FunctionDeclaration**

### **Tests**

```
function foo() {}
```

* `[ ]` variable env contains `foo: FunctionObject`
* `[ ]` foo has body, name, type

---

# **8) UC08 — CallExpression**

### **Tests**

```
function foo() { return 5; }
foo();  → 5
```

* `[ ]` new context created
* `[ ]` child lexical + variable envs created
* `[ ]` function body runs
* `[ ]` return stops execution
* `[ ]` context popped

Nested:

```
function outer() {
  function inner() { return 10; }
  return inner();
}
outer() → 10
```

* `[ ]` nested call frames correct

---

# **9) UC09 — Closures & Nested Scopes**

### **Tests**

```
let x = 1;
function foo() {
  return x;
}
foo() → 1
```

Nested variable:

```
function outer() {
  let x = 10;
  function inner() { return x; }
  return inner();
}
```

* `[ ]` inner function sees outer lexical
* `[ ]` lookup follows correct environment chain

---

# **PHASE 3 — CONTROL FLOW**

---

# **10) UC10 — BlockStatement**

### **Tests**

```
{
  let x = 1;
}
resolve("x") → undefined
```

Shadowing:

```
let x = 1;
{
  let x = 2;
  x → 2
}
x → 1
```

* `[ ]` block-scope isolation working
* `[ ]` shadowing correct

---

# **11) UC11 — ForStatement**

### **Tests**

```
let sum = 0;
for (let i = 0; i < 3; i++) {
  sum = sum + i;
}
sum → 3
```

Checks:

* `[ ]` init executed once
* `[ ]` test evaluated each iteration
* `[ ]` body executed until false
* `[ ]` update executed last in each loop
* `[ ]` i increments correctly

Nested test:

```
for (var i = 0; i < 2; i++) {
  let x = i;
}
```

* `[ ]` check var vs let behavior

---

# **PHASE 4 — ASYNC**

---

# **12) UC12 — Async Tick**

### **Tests**

```
schedule microtask A
schedule macrotask B
tick()
```

* `[ ]` A executes before B
* `[ ]` each callback pushes/pops call stack frame
* `[ ]` queues emptied correctly

Extended:

```
microtask A
microtask B
macrotask C
```

Execution order:

* `[ ]` A → B → C

---

# **📐 Systemic Integrity Validation**

These tests cover:

### **Space**

* environment binding
* scope chain
* nested envs
* block envs
* lexical/variable resolution

### **Time**

* call stack
* context lifecycle
* return semantics
* loop iteration semantics
* async scheduler

### **Integration**

* control flow dispatch
* evaluator
* runtime orchestrator

This is the **complete minimum spec**, no waste.

---
