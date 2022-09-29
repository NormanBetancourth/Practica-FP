/**
* Simulates a web service yielding persons
@author loricarlos@gmail.com
@version demo

*/

//Tools para filtros
//Tools para filtros
const not = f => p => !f(p)
const True = () => true
const False = not(True)
const and2 = (f1, f2) => p => f1(p) && f2(p)
const and = (...filters) => filters.reduce(and2, True)
const or2 = (f1, f2) => p => f1(p) || f2(p)
const or = (...filters) => filters.reduce(or2, filters.length > 0 ? False : True)



//Filtros planos

const male = p => p?.gender === 'M'
const female = not(male)

const child = p => p?.age >= 18
const tenager = p => p?.age >= 18
const adult = p => p?.age >= 18
const senior = p => p?.age >= 18

const startsLetterS = p => p?.firstname.startsWith('S')


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

export function get_persons(url = "/person", delay = 0) {
  return new Promise((then) =>
    setTimeout(() =>
      then(JSON.stringify(persons.map((p) => p.toObj())), (delay % 1000) * 1000)
    )
  );
}

function filterBuilder(tipo, p = {id: -1, firstname: '', lastname: '', age: 0, gender: 'M'}){


  // x?.P 
  switch(tipo){
    case 'id':
      return ((p, id) => id == '' ||  p?.id == id);
    case 'gender':
      return ( (p, {gender}) => gender == p?.gender);
    case 'age':
      return (({age}, {ageRange}) => age <= ageRange?.max && age >= ageRange?.min)

  }
 


}

// console.log('>>>1',persons.filter(and(male,adult,startsWithLetterS)))
// console.log('>>>2',persons.filter(and(adult,startsWithLetterS)))
// console.log('>>>3',persons.filter(and()))
// console.log('>>>4',persons.filter(or2(male,startsWithLetterS)))
// console.log('>>>5',persons.filter(or(male,startsWithLetterJ, startsWithLetterS)))
// console.log('>>>6',persons.filter(or()))


export function getPersonById(url = "/person", id, arr, delay = 0) {

    return new Promise((then) =>
      setTimeout(() =>
        then(JSON.stringify(arr.filter(e => filterBuilder('id')(e, id)))), (delay % 1000) * 1000)
    );
}


export function getPersonsBySelection(url = "/person", querryOptions, delay = 0, arr) {
    
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