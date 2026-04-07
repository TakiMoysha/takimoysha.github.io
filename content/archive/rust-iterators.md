
---
title: Итераторы в Rust
description: Описание итераторов и работы с ними в rust
date: "20260410"
draft: false
tags:
  - rust
  - low-level
---

### Rust Iterators

Итераторы в Rust представляют собой один из самых сложных аспектов стандартной библиотеки.
Стандартная либа содержат почти 100 методов и около 150 реализаций трейтов.

Самыми важными концепциями для итераторов является **lazy evaluation** и **zero-cost abstraction**:

- итераторы ленивы, то есть выполняются только при вызове `next`.
- rust-итераторы это zero-cost абстракция над конвеером обработки данных, итератор не хранит данными, это только инструкция как получить и преобразовать следующий элемент.

Далее мы рассмотрим различные варианты итераторов, их особенности и применение.
Глубоко погружаться не будем, затронет только необходимые реализации.

**combined iterators** - под комбинированием понимается последовательный вызов итераторов (как монады), последующие итераторы будут содержать логику предыдущих. Для упрощенного вкатывания есть: `filter`, `map`, `flat_map`, `zip` и `enumerate`. Они ведут себя как и в других языках.

#### Основные типы итераторов

**Базовый Итератор**:
Основной крейт. Трейт `Iterator` является базовым трейтом, реализует `next`.
Что свойственно для него, то свойственно и для всех остальных. Например он являеться ленивым, то есть он не выполняет итерацию, пока не будет вызван `next`.

```rust
use std::iter::Iterator;

let v = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let mut v_iterator = v.iter();
println!("{:?}", v_iterator.next());
```

Связан с трейтом `IntoIterator`, который делает типы итерируемыми.

```rust
pub struct Counter {
    count: u32,
    limit: u32,
}

impl Iterator for Counter {
  type Item = u32;

  fn next(&mut self) -> Option<u32> {
      if self.count < self.limit {
          self.count += 1;
          return Some(self.count);
      }
      None
  }
}
```

Многие структуры реализуют трейт итераторов, мы можем получить их через идиоматическиe: `iter`, `iter_mut` и `into_iter` или кастомные как `BufReader::lines`:

```rust
// или читайте файл вродe std::fs::File::open("foo.txt").expect("Failed to open file")
let mut bytes = &b"hello world!\nERROR: unknown type\nPayload"[..]; //
for line in BufReader::new(bytes).lines() {
    match line {
        Ok(l) if l.starts_with("ERROR") => println!("CORRUPTED-LINE:\t\t{}", l),
        Ok(l) => println!("GOOD-LINE:\t\t{}", l),
        Err(e) => panic!("ERROR: {}", e),
    }
}
```

**BoundedIterator**:
Итераторы, которые реализуют `size_hint`, указывающий сколько элементов осталось в итераторе. Напримeр `ExactSizeIterator` или `TrustedLen`.

```rust
 let v = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
dbg!(v.len()); // длина вектора, не итератора
dbg!(v.iter().size_hint());
dbg!(v.iter().filter(|x| *x % 2 == 0).size_hint());
```

Разберемся с `size_hint`, он работает чуть сложнее, чем просто `len` или `count` (`count` считает длину вектора, то есть забирает владение и проходит по всему итератору). Вместо длины, `size_hint` возвращает нижнюю и верхнюю границу итератора.
В нашем случае `size_hint` вернет `(10, Some(10))`, а для итератора с фильтрацией `(0, Some(10))`, т.к. фильтр может как отбросить все значения так и вернуть их все. Заметьте, второе значение - `Some(*)`, если rust не может вычислить верхнюю граници, то вернется `None`.

```rust
v_itert.filter(|x| x % 2 == 0).len() // error
```

А зачем нам знать, сколько памяти нужно? Если мы делаем `collect::<Vec<_>>()` на длинном итераторе без размера, то rust, вероятнее всего, выделит недостаточно памяти и после придется делать `realloc` каждый раз, когда найдется новый элемент.

```rust
let even_numbers: Vec<i32> = (1..100)
    .filter(|x| x % 2 == 0)
    .collect();

// Если мы знаем размер, то мы можем выделить необходимую память использует `Vec::with_capacity`
let mut result = Vec::with_capacity(50);
for x in (1..100).filter(|x| x % 2 == 0) {
    result.push(x);
}
```

Полезен, если мы делаем `collect` для сборки коллекции.

**FusedIterator**:
Безопасный итератор, в том плане, что после первого `None` всегда далее будет возвращать `None`. Эти гарантии важны для оптимизации компилятора и ветвление в коде, если оператор "израсходован", он может не делать проверки а возвращать статический `None`.

```rust
let mut iter = vec![1, 2, 3].into_iter().filter(|x| x % 2 == 0);

assert_eq!(iter.next(), Some(2));
assert_eq!(iter.next(), None);
assert_eq!(iter.next(), None);
```

```rust
pub struct Counter {
    count: u32,
    limit: u32,
}

impl Iterator for Counter {
  type Item = u32;

  fn next(&mut self) -> Option<u32> {
      if self.count < self.limit {
          self.count += 1;
          return Some(self.count);
      }
      None
  }
}

let main() {
  let c = Counter { count: 0, limit: 10 };

  let mut iter = c.iter().fuse();
}
```

Как правило `FusedIterator` не нужно явно реализовывать, достаточно использовать `Iterator::fuse()`. Если же итератор уже зафьюжен, то дополнительная оболочка Fuse будет простаивать без снижения производительности.

**Double-Ended Iterator**:
Позволяет извлекать элементы как с начала, так и с конца итератора. Добавляет метод `next_back`, который возвращает последний элемент.

```rust
let mut v = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let mut v_iterator = v.iter();
assert_eq!(v_iterator.next(), Some(&1));
assert_eq!(v_iterator.next_back(), Some(&10));
```

**Compile-Time Iterator**:
Позволяет выполнять итерацию во время компиляции, используя блоки `static`, `const {}` и `const fn`.

```rust
const fn compiled_factorial(n: u32) -> u32 {
    if n == 0 {
        1
    } else {
        n * compiled_factorial(n - 1)
    }
}

static FACT_10: u32 = compiled_factorial(10); // в runtime попадет только результат
```

Это называется _constant folding_. Что бы проверить можете скопировать код вычисления факториала и скомпилировать бинарник. Что бы проверить можете запустить в `gdb`. Например, у меня это записанно в файле `./examples/iterators.rs`, после сборки `cargo run --debug --example iterators` я запускаю `gdb target/debug/examples/iterators` и вводжу `iterators::FACT_10`. В release сборе не будет отладочних символов, так что gdb может писать ошибки, что не может загрузить переменную.

```gdb
(gdb) print iterators::FACT_10
$1 = 3628800
```

> Если вы используете `cargo-expand`, то он смотрит до линковки, поэтому там должно быть все.

**Iterator with a Return Value**:
По завершению итераций возвращает какое-то значение. Это позволяет завершать свою работу с некоторым итоговым значением, подобно функциям (или агрератам из sql) - итератор возвращает значение:

```rust
let sum: i32 = nums.iter().sum();
let max: Result<i32, (_)> = nums.iter().max();

// круто использовать с fold, можно реализовать практически все
let result = data.iter().fold(
  (0, 0),
  |(count, sum), &x| (count + 1, sum + x),
);
```

Если есть несколько циклов их можно объединить в fold.

**Short-Circuiting Iterator**
Позволяет остановить итератор, когда было выполненно условие. Методы для остановки: `find()`, `any()`, `all()`, `take_while()`.

```rust
let nums: Vec<i32> = (1..10).collect();
let first_even = nums.iter().find(|&&x| x % 2 == 0);
dbg!(first_even);
///
assert!(nums.iter().any(|&x| x > 10));
///
let logs: vec<String> = ...;
let first_error = logs.iter().find(|&l| l.starts_with("ERR"));
```

**AsyncIterator**:
Для асинхронных итераторов нужно работать с `Stream` и `Future`. В отличие от `Iterator` стримы могут быть приостановлены и возвращать данные в произвольном порядке.

```rust
use smol;
use futures::stream::{self, StreamExt};

async fn process_stream() {
  let mut stream = stream::iter(vec!["a", "b", "c"]);

  let processed: Vec<_> = stream.map(|s| s.to_uppercaser()).collect().await;

  dbg!(processed);
}

fn main() {
  smol::run(process_stream());
}
```

Классические примеры это чтение из IO - диск, сеть и т.д. Мы можем не ждать полного ввода или выдачи данных, вместо этого читаем их кусками, обрабатываем и переходим к следующему.

**Thread-Safe Iterator** (`Sync+Send`):
Условный итераторв, это комбинация трейтов `Send` (передачу) и `Sync` (читать из разных потоков) с базовым итератором. Итератор не делает вычисления параллельными, но комбинация создает условия для безопасной работе в многопотоке.

```rust
let data = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let handle = thread::spawn(move || {
  data.iter()
    .map(|x| x * 2)
    .filter(|x| x % 2 == 0)
    .collect::<Vec<u32>>()
});
dbg!(handle.join().expect("Failed to join thread"));
```

Если структура сложная, в ней есть `Mutex` или не `Send`, итератор работать не будет. Для совместного доступа к данным нужно использовать атомарный счетчик - `Arc`.

**ConcurrentIterator** или **ParallelIterator** (`Sync+Send`):
Итераторы для параллельных вычислений, может использовать несколько потоков, что позволяет значительно увеличить производительность при работе с большими объемами данных. Справедливо то же, что и для _ThreadSafeIterator_.

Встроенных параллельных итераторов нету (map.reduce, zip не параллельныe (?)), что бы с ними поработать нам придеться использовать `rayon`.

```rust
use rayon::prelude::*;

let data = (1..100_000).collect::<Vec<_>>();
let sum: i32 = data.par_iter().map(|x| x * x).filter(|x| x % 2 == 0).sum();
println!("Sum: {}", sum);
```

Заметьте, мы используем не `iter` а `par_iter` ( и `into_par_iter` вместо `into_iter`) для параллельных вычислений.

Стоит заметить, что если необходимо обрабатывать структуры, то они должны быть thread-safe. Либо реализовать `Send+Sync` или обернуть их в `Arc`.

#### Bonus

**Iterator Guaranteeing Destruct** (bonus)
Гарантирует, что деструкторы будут вызваны. Автоматическое освобождение `Drop`.

```rust
impl Drop for Counter {
  fn drop(&mut self) {
    println!("Dropping Counter with count {}", self.count);
  }
}
```

**Address-Sensitive Iterator** (bonus)
Не built-in, но полезная практика. Поддерживает само-ссылающиеся типы, которые должны сохранять свое адресное пространство. То есть, типы иеют поля, который ссылаются на другие поля внутри того же типа, что требует стабильности адреса в памяти.

В Rust, когда используются локальные переменные, важно, чтобы их адрес оставался стабильным на протяжении жизни объекта. Это особенно актуально для генераторов, которые могут создавать самоссылочные типы. Подробнее в `pin` модуле.

**Iterator with a Next Argument** (bonus)
Не built-in, но полезная практика. Позволяет передавать дополнительные аргументы в метод `next`, дает больше интерактивности, давая пользователю управлять его поведением во премя итерации.

**Dyn-Compatible Iterator** (bonus):
Не built-in, но полезная практика. Итератор с динамический диспатчингом, вычислением метода во время исполнения, используя ключевое слово `dyn`.

**Seeking Iterator** (bonus):
Не built-in, но полезная практика. Предоставляет возможность управления курсором, позволяя перемещаться по итератору. Реализуется через trait `Seek`, который дает контроль над курсором `Read` в типах, которые его поддерживают.

#### Advanced

**LendingIterator** (advanced):
Местами очень полезный итератор, связанный с концепциями владения в rust.
Проблема: итератор выдает `&T`, но `T` принадлежит самому итератору.

```rust
struct DNA {
  sequence: String,
}

impl Iterator for DNA {
  type Item = &str;

  fn next(&mut self) -> Option<Self::Item> {
    // вернем &self.sequence[...]
    // rust не может гарантировать, что self.sequence жиет дольше чем &str => ошибка компиляции
  }
}
```

Перед тем, как посмотреть настоящий lending итератор, посмотрим на альтернативный путь:

```rust
use itertools::Itertools;


let sequence = "ACGTCGAGTCGACGTCGAGTCGAGTCGAGTCGAGTCGAGTCGA";
let linse: Vec<&str> = text.lines().collect(); // не владеет данными
```

Здесь `lines()` возвращает итератор, который не хранит строки, а указывает на `&str` внутри `sequence`. Это безопасный заимствованный итератор.

Lending итератора - позволяет итераторам выдавать ссылки на элементы, которыми они владеют.

> [!note] Generic Associated Types, пока что экспериментальны.

```rust
let v_iter = gen {
  let sequence = "ACGTCGAGTCGACGTCGAGTCGAGTCGAGTCGAGTCGAGTCGA";
  yield &sequence[0..5]; // указывает на локальное значение на куче
}
```

**`itertools`** (advanced) - Либа для работы с итераторами, Сейчас затронем только `chain` из нее.
`chain` объединяет несколько итераторов в один поток данных. `into_iter` мутирует данные и создает промежуточные структуры для этого, `chain` работает лениво, переключает источник данных на следующий, когда первый заканчивается.

```rust
use itertools::Itertools;

fn main() {
  let mut first = vec![1, 2, 3];
  let mut second = vec![3823, 2819, 3890];
  let mut third = vec![1882475, 918741, 18794];

  let chained = first.iter().chain(second.iter()).chain(third.iter());
}
```
1. [A Survey of Every Iterator Variant / blog.yoshuawuyts.com](https://blog.yoshuawuyts.com/a-survey-of-every-iterator-variant/)
2. [TakiMoysha / tm-rust-book / github.om](https://github.com/TakiMoysha/tm-rust-book/tree/main/primitives/iterators)
3. 
