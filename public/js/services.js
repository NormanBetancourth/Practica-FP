/**
* Simulates a web service yielding persons
@author loricarlos@gmail.com
@version demo

*/

import personsJson from "./../../persons.json" assert { type: "json" };

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
// const persons=[
//     new Person("John", "Doe", 56, Gender.MALE),
//     new Person("Mary", "Doe", 30, Gender.FEMALE)
// ]

//TODO: preguntar al profe pq no se retorna new
// console.log(new Person("John", "Doe", 56, Gender.MALE));
const persons = personsJson.persons.map((person) => {
  return new Person(
    person.firstname,
    person.lastname,
    person.age,
    person.gender
  );
});

export function get_persons(url = "/person", delay = 3) {
  let p = new Promise((then) =>
    setTimeout(() =>
      then(JSON.stringify(persons.map((p) => p.toObj())), (delay % 1000) * 1000)
    )
  );
  return p;
}

export function getPersonById(url = "/person", id, arr, delay = 3) {
    let p = new Promise((then) =>
      setTimeout(() =>
        then(JSON.stringify(arr.filter((p) => id == ''? true : p.id == id)), (delay % 1000) * 1000)
      )
    );
    return p;
}


//{queryOptions: {ageRange: {min:number, max:number}, gender:string}}
export function getPersonsBySelection(url = "/person", querryOptions, delay = 3, arr) {
    let p = new Promise((then) =>
      setTimeout(() =>
        then(JSON.stringify(arr.filter((p) => {
            return querryOptions.gender == 'ALL'? true: (querryOptions.gender == p.gender)
        })
        .filter((p) => {return querryOptions.ageRange.min == 'ALL'? true: ( p.age <= querryOptions.ageRange.max && p.age >= querryOptions.ageRange.min)})
       ), (delay % 1000) * 1000)
      )
    );
    return p;
}

