/**
* Simulates a web service yielding persons
@author loricarlos@gmail.com
@version demo

*/

//Tools para filtros
const not = (f) => (p) => !f(p);
const True = () => true;
const False = not(True);
const and2 = (f1, f2) => (p) => f1(p) && f2(p);
const and = (...filters) => filters.reduce(and2, True);
const or2 = (f1, f2) => (p) => f1(p) || f2(p);
const or = (...filters) =>
  filters.reduce(or2, filters.length > 0 ? False : True);

//Filtros custom
const filtros = new Map();

//gender
const male = (p) => p?.gender === "M";
const female = not(male);

//age
const child = (p) => p?.age >= 1 && p?.age <= 11;
const teenager = (p) => p?.age >= 12 && p?.age <= 20;
const adult = (p) => p?.age >= 21 && p?.age <= 64;
const senior = (p) => p?.age > 64;
const idIs = id => p => id === "" || p?.id == id ;

// //all
// const all = () => true

filtros.set("male", male);
filtros.set("female", female);
filtros.set("child", child);
filtros.set("teenager", teenager);
filtros.set("adult", adult);
filtros.set("senior", senior);
filtros.set("id", idIs);
filtros.set("all", True);

function filterBuilder(tipo) {
  try {
    return filtros.get(tipo);  
  } catch (error) {
    return filtros.get('all');
  }
  
}

const res = await fetch("./../../persons.json");
let personsJson = await res.json();

const Gender = {
  MALE: 2,
  FEMALE: 4,
};

class Person {
  static #id_counter = 0;
  #id;
  #firstname;
  #lastname;
  #age;
  #gender;
  constructor(firstname, lastname, age, gender) {
    [this.#firstname, this.#lastname, this.#age, this.#gender] = [
      firstname,
      lastname,
      age,
      gender,
    ];
    this.#id = Person.#id_counter++;
  }
  get id() {
    return this.#id;
  }
  get firstname() {
    return this.#firstname;
  }
  get lastname() {
    return this.#lastname;
  }
  get age() {
    return this.#age;
  }
  get gender() {
    return this.#gender;
  }
  toObj() {
    return {
      id: this.id,
      firstname: this.firstname,
      lastname: this.lastname,
      age: this.age,
      gender: this.gender == Gender.MALE ? "M" : "F",
    };
  }
}

const personsData = personsJson.persons.map((person) => {
  return new Person(
    person.firstname,
    person.lastname,
    person.age,
    person.gender
  );
});

const persons = personsData.map((p) => p.toObj())

export function get_persons(url = "/person", delay = 0, options = {}) {
  //opciones para los filtros, usa MAP con los filtros
  const age = filterBuilder(options.age);
  const gender = filterBuilder(options.gender);
  const id = filterBuilder("id");

  console.log(id)

  return new Promise((then) =>
    setTimeout(() =>
      then(
        JSON.stringify(
          persons.filter(and(age, gender, id(options.id)))
        ),
        (delay % 1000) * 1000
      )
    )
  );
}
