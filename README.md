save-pass-system
================

Простое описание безопасного хранения и передачи паролей. <br>
Этот метод подразумевает только передачу hash функции пароля. <br>
То есть сервер никогда не получит пароль пользователся в открытом виде. <br>
Также он защищает от атак типа MITM. <br>
И возможно это один из известных алгоритмов.

### Шаг 1
Формирование на сервере хеш функции от секретного слова + даты

```js
var secretKeyWord = "omk6tqawvubz8jtr370748xy5nfyum";
var data = new Date().toLocaleDateString();

var hashServer = hash(secretKeyWord + data);
```

### Шаг 2
Сервер встраивает hashCode в страницу авторизации. <br>
Клиент при отправке пароля формирует хеш.

```js
var hashServer = getHashServer(); // Сформированный хеш севера

var password = "my password";
var login = "my login";

var hashPass = hash(password); // Хеш пароля
var hashClient = hash(hashPass + hashServer);
send(hashClient, login); // Отправка хеша сервера и логина
```

### Шаг 3
Проверка пользовательских данных на сервере.

```js
var secretKeyWord = "omk6tqawvubz8jtr370748xy5nfyum";
var data = new Date().toLocaleDateString();

var hashServer = hash(secretKeyWord + data);

function autorization(hashClient, login)
{
  var userPassFromBD = bd.getUserPass(login); // Пароль, который хранится в базе данных в виде хеш функции: hash(password);
  var tempHash = hash(userPassFromBD + hashServer);
  
  if (tempHash === hashClient)
  {
    return true; // Если пароль правильный
  }
  else
  {
    return false; // Если пароль неправильный
  }
}
```
