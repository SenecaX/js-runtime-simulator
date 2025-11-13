# **📘 F) MINIMAL RUNTIME SPECIFICATION DOCUMENT**

# **0. Scope**

This runtime implements a **deterministic, single-threaded**, **interpreted**, **simplified JavaScript execution model**:

* no JIT
* no bytecode
* semantic correctness prioritized
* strict causal ordering
* minimal behaviors only

It covers:

* environments
* variable declarations
* expression evaluation
* control flow
* functions
* call stack
* context lifecycle
* loops
* async queue + event loop

It does **not** implement:

* classes
* modules
* garbage collection
* real closures with persistent references (only lexical chains)
* full ECMAScript spec deviation handling

---

# **1. Execution Context Model**

Every executing unit runs inside a **context**, defined by:

* **LexicalEnvironment** (let/const)
* **VariableEnvironment** (var / function declarations)
* **thisBinding**
* **depth** (stack depth)

A context is created:

* when runtime starts (Global)
* when a function is called

Destroyed:

* when function returns
* when runtime terminates

---

# **2. Environments**

## **2.1 LexicalEnvironment**

* Stores `let` and `const` bindings.
* Has an `.outer` reference to parent environment.
* Provides:

  * `define(name, value)`
  * `lookup(name)` → recursive through outer chain

Used for:

* block scoping
* function scoping (for let/const)
* closure behavior

---

## **2.2 VariableEnvironment**

* Stores `var` and `function` bindings.
* Has an `.outer` reference.
* Provides:

  * `define(name, value)`
  * `lookup(name)`

Used for:

* var hoisting semantics
* function declarations

---

## **2.3 Scope Chain**

Name resolution algorithm:

1. Look in starting environment record.
2. If missing → move to `.outer`.
3. If none found → error (or undefined in your simplified design).

This is identical for lexical or variable paths.

---

# **3. Call Stack Model**

Call stack is a LIFO stack of **ExecutionContext** objects.

Operations:

* `pushContext(name)`
* `popContext()`
* `peekContext()`

A new call frame is created **only**:

* at global init
* on function call

A frame is destroyed on:

* function return
* program termination

---

# **4. Variable Binding**

For a **VariableDeclaration** node:

```
kind: let | const | var
name: identifier
init: expression | null
```

### **let**

* stored in lexical environment
* initializer may be null → value = undefined

### **const**

* stored in lexical environment
* initializer required
* reassignment forbidden

### **var**

* stored in variable environment
* hoisted (in your simplified model, effectively “available” at execution time)
* initializer optional → undefined if missing

---

# **5. Lookup (Identifier Resolution)**

Evaluation of an Identifier node:

```
Identifier: { name }
```

Steps:

1. Attempt lookup in current lexical environment chain.
2. If not found → attempt lookup in variable environment chain.
3. If not found → return undefined.

(Your simplified design soft-fails instead of throwing ReferenceError).

---

# **6. Expression Evaluation**

Supported expression types:

### **Literal**

Return `literal.value`.

### **Identifier**

Resolved via runtime.resolve → ScopeChain

### **BinaryExpression**

Evaluate left → Evaluate right → apply operator
Supported operators:

* +, -, *, /
* <, <=, >, >=
* ==, ===

### **AssignmentExpression**

Evaluate RHS → mutate existing binding → return new value.

---

# **7. Control Flow Execution**

Program nodes executed sequentially:

```
for each node in body:
    dispatch(node)
```

Supported nodes:

* VariableDeclaration
* ExpressionStatement
* FunctionDeclaration
* ForStatement
* IfStatement
* ReturnStatement

### **ReturnStatement**

Stops execution inside current context and returns `{ type: "return", value }`.

---

# **8. Functions**

### **FunctionDeclaration**

Creates:

```
{
  type: "FunctionObject",
  name,
  body
}
```

Stored in **variable environment** (like JS).

### **CallExpression**

Execution steps:

1. Evaluate callee identifier.
2. Retrieve FunctionObject.
3. runtime.enterFunction(name):

   * create ExecutionContext
   * create child lexical + variable envs
4. execute function body
5. runtime.exitFunction()

Variable resolution inside function:

* lexical → variable → outer chains via `.outer`

This supports closures *implicitly*.

---

# **9. Block Statements**

Block `{}` creates a new **LexicalEnvironment** (if block scoping is implemented):

```
newEnv.lexical.outer = current.lexical
```

After block ends:

* lexicalEnv restored
* variableEnv unaffected

---

# **10. Loops**

### **ForStatement**

Execution:

1. Execute init
2. While test is truthy:

   * execute body
   * execute update

Loop maintains:

* per-iteration identifier resolution
* mutation via AssignmentExpression
* correct update logic (++/--)

---

# **11. Async Model**

Async system has:

### **Macro-task queue**

* timeouts
* simulated callbacks

### **Micro-task queue**

* promise callbacks

### **Scheduling Rules**

1. Execute microtasks until empty
2. Execute one macrotask
3. Repeat

### **Execution**

Each callback pushes/pops a simulated call frame.

(Not real JS microtask semantics, but structurally correct for your simulator.)

---

# **12. Runtime Engine Responsibilities**

Runtime acts as **orchestrator**:

1. Initialize global context
2. Parse code → AST
3. Execute AST via ControlFlowWorkflow
4. Manage environments
5. Enter/exit functions
6. Provide resolve/define APIs
7. Render snapshots (optional UI)
8. Manage async workflow (if used)

RuntimeEngine must not:

* evaluate expressions directly
* store unnecessary state
* bypass workflows
* break layering integrity

---

# **13. Layering Rules (Systemic Integrity)**

This is the MOST important part:

### **L1 Core**

* No knowledge of JS semantics
* Pure data structures

### **L2 Mechanisms**

* Know JS rules
* No AST or runtime awareness

### **L3 Components**

* Combine mechanisms
* No orchestration logic

### **L4 Workflows**

* Time-based orchestration
* No state ownership
* No direct stack manipulation outside the lifecycle workflow

### **L5 Runtime**

* The only place allowed to integrate multiple workflows
* No evaluation logic
* No mechanism logic

This is the system’s structural backbone.

---

# **14. Minimal Behavioral Guarantees**

Your runtime guarantees:

* deterministic execution
* deterministic scope chaining
* deterministic call stack ordering
* deterministic async ordering
* no side effects outside current context
* no backdoor state mutations

This makes the runtime **predictable, re-writable, and testable**.

---

# **15. Simplifications (by design)**

These are approved simplifications:

* no TDZ
* no strict mode
* no real hoisting phases
* no lexical binding errors
* no advanced operator behaviors
* no argument passing
* no closure persistence objects

These can be added later as extended specs.

---
