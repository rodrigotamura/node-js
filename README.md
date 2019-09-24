# Introduction

Node.js foi criado pensando em um modelo não bloqueante quando são feitas operações de entrada/saída de dados (I/O). Quando falamos de modelo não-bloqueante, precisamos falar sobre o modelo de desenvolvimento tradicional utilizando linguagens tradicionais.... Se você está desenvolvendo com linguagens como Java ou C# sem a utilização de recursos de paralelismo e assincronia, cada linha é executada somente quando a linha de código anterior finalizou sua execução. Cada linha “bloqueia” a execução da linha posterior enquanto ela não finaliza sua execução. Agora, no contexto de aplicações Web, isso pode ser um problema. Quando um servidor recebe uma requisição de um cliente, ao executar uma operação I/O, o processamento é paralisado. Isso significa que quando são feitas operações como uma leitura em disco ou consulta de banco de dados, as requisições de outros clientes vão sendo enfileiradas. Após o processamento ser finalizado e respondido ao primeiro cliente, o próximo cliente é atendido. Quanto mais requisições, maior vai ficando a fila, e mais lenta vai ficando a resposta.

No modelo não bloqueante do Node.js, as operações de I/O não bloqueiam o atendimento aos outros clientes. Enquanto uma leitura de disco está sendo feita, o Node.js já vai atendendo os próximos clientes da fila, aproveitando o potencial do processador, evitando assim que parte de seu poder fique ocioso.

# Trabalhando com módulos

No Node.js é muito importante saber trabalhar com modularização, principalmente pelo fato do código ficar mais organizado.

Para fazer com que um script JS seja IMPORTÁVEL, é necessário utilizar um comando do Node:

```javascript
const Dog = {
  name: "Rex",
  bark: () => {
    console.log("woof!");
  }
};

module.exports = Dog; // 👈 this is the command I've told
```

And within the file (app.js) which will import it, we implement as bellow:

```javascript
Dog = require("./dog"); // is not necessary to put .js (only for JS file)
console.log(Dog.name);
Dog.bark();
```

Run `node app.js`

# Event emitters

Javascript itself is event driven. Event could be an access to database, opening a file, requesting at some external API, and so on.

In this approach we will learn how to create an event. We going to import:

```javascript
var EventEmitter = require("events");
var emitter = new EventEmitter();
```

In order to prepare our Emitter starts to LISTEN with `on('event_name', callback_function())`:

```javascript
emitter.on("my_event", function() {
  // what should happen when 'my_event' is executed
  console.log("my event");
});
```

But, how could we make this `my_event` be executed? Remember, our code is LISTENING for this specified event called `my_event`. We will make it with `emitter.emit()` function:

```javascript
emitter.emit("my_event");
```

Execute `node event.js` and you will realize that `my_event fired` was displayed in console.

### Setting params

We could add params in order to make it more dynamic:

```javascript
emitter.on("my_event", (...number) => console.log(number));

emitter.emit("my_event", 123, 321, 12, 4);
```

### Inharitance

We could also create other objects and make it inheritance the behavior from some event emitter:

```javascript
class Dog extends EventEmitter {
  bark() {
    console.log("woof woof!");
  }
}

var Rex = new Dog();

Rex.on("bark_please", Rex.bark);

Rex.emit("bark_please");
Rex.emit("bark_please");
Rex.emit("bark_please");
```

You can make the event stops to listen to the specified event:

```javascript
// class Dog (...same as above)
Rex.emit("bark_please"); // shows     ⬇ name of the function obliged
Rex.removeListener("bark_please", Rex.bark);
Rex.emit("bark_please"); // will not show
Rex.emit("bark_please"); // will not show
```

**Why do we need inform the name of the function (`Rex.bark`) within `removeListener()`?**. Because with the same event we could create different functions:

```javascript
var EventEmitter = require("events");

var emitter = new EventEmitter();

class Dog extends EventEmitter {
  bark() {
    console.log("woof woof!");
  }

  sleep() {
    console.log("ZZZzzzzz...");
  }
}

var Rex = new Dog();

Rex.on("bark_please", Rex.bark);
Rex.on("bark_please", Rex.sleep);

Rex.emit("bark_please");
// > woof woof!
// > ZZZzzzzz...
Rex.removeListener("bark_please", Rex.bark); // stopping only bark, sleep continues
Rex.emit("bark_please");
// > ZZZzzzzz...
Rex.emit("bark_please");
// > ZZZzzzzz...
```

### Executing evente once

Till now our event might be fired every time we want, however if we implement like bellow:

```javascript
// Rex.on("bark_please", Rex.bark);
Rex.once("bark_please", Rex.bark);

Rex.emit("bark_please"); // woof woof!
Rex.emit("bark_please"); // not displays
```

# Handling files - write and read

Node.js has a nattive module called **fs (file system)**:

```javascript
const fs = require("fs");
```

Let's create a new file called _file_name.txt_ and add some content within it:

```javascript
// the function bellow is assynchronous, that's why we need a callback function
// which receives an error variable (indicating errors)
fs.writeFile("file_name.txt", "Content put here!!!", function(err) {
  if (err) {
    console.error(err);
  } else {
    console.log("File created");
  }
});
```

Now let's read this created file:

```javascript
fs.readFile("file_name.txt", function(err, data) {
  if (err) {
    console.error(err);
  } else {
    console.log(data.toString());
  }
});
```

# Error handling

When our app has some error, generally it will crash and stops to execute the next lines.

We could force an error - and crash the application - executing this:

```javascript
throw new Error("some error occurred here!!!!!");
```

And the next code WILL NOT BE executed!

> _There are many procedures in our code implementations which are error prone. E.g., requesting an API, consulting database, reading/opening files, and so on. And in these codes WE MUST to implement a more elegant errors handling and keep our application running._

We can treat these errors without crash our application using `Error` object (JS native) with the code bellow:

```javascript
new Error("A standard error");
```

It will generate an error at the console, however it will not crash the app, keeping our code running till the end.

If you want to custom the functionallity of these errors, we can create a class which extends from `Error` object:

```javascript
class TreatErrors extends Error {
  constructor(args) {
    super(args);
    this.name = "Elegant error:";

    // you could save this error in a log, use Sentry, and so on
  }
}

console.log(new FancyError("Error here mannn!!"));
```
