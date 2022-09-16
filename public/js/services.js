/**
* Simulates a web service yielding persons
@author loricarlos@gmail.com
@version demo

*/

// import personsJson from "./../../persons.json" assert { type: "json" };

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


const persons = personsJson.persons.map((person) => {
  return new Person(
    person.firstname,
    person.lastname,
    person.age,
    person.gender
  );
});

export function get_persons(url = "/person", delay = 3) {
  return new Promise((then) =>
    setTimeout(() =>
      then(JSON.stringify(persons.map((p) => p.toObj())), (delay % 1000) * 1000)
    )
  );
}

function filterBuilder(tipo, p = {id: -1, firstname: '', lastname: '', age: 0, gender: 'M'} , querryOptions = {ageRange: {min:'ALL', max:'ALL'}, gender:'ALL'} ){


  // x?.P 
  switch(tipo){
    case 'id':
      return ((p) => id == '' ||  p.id == id);
    case 'gender':
      return ( (p, {gender}) => gender == p.gender);
    case 'age':
      return ((p, querryOptions) => p.age <= querryOptions.ageRange.max && p.age >= querryOptions.ageRange.min)

  }
 


}



export function getPersonById(url = "/person", id, arr, delay = 0) {

    return new Promise((then) =>
      setTimeout(() =>
        then(JSON.stringify(arr.filter(e => filterBuilder('id', e) ))), (delay % 1000) * 1000)
    );
}






export function getPersonsBySelection(url = "/person", querryOptions, delay = 3, arr) {
    
  const filterGender = querryOptions.gender == 'ALL'? (() => true): filterBuilder('gender')
  const filterAge = querryOptions.ageRange.min  == 'ALL'? (() => true): filterBuilder('age')

  return new Promise((then) =>
    setTimeout(() =>
      then(JSON.stringify(arr.filter( p => filterGender(p, querryOptions))
      .filter((p) => filterAge(p, querryOptions))
      ), (delay % 1000) * 1000)
    )
  );
}